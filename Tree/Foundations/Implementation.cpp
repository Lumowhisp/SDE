#include <iostream>
#include<algorithm>
#include<queue>

using namespace std;
struct Node{
    int data;
    Node* left;
    Node* right;
};
Node* newNode(int data){
    Node* temp=new Node();
    temp->data=data;
    temp->left=NULL;
    temp->right=NULL;
    return temp;
}

Node* createTreeBFS(){
    queue<Node*>q;
    int data;
    cout<<"Enter root Element ::";
    cin>>data;
    if(data == -1) return NULL;
    Node* root=newNode(data);
    q.push(root);
    while(!q.empty()){
        Node* head=q.front();
        int leftElement;
        cout<<"Enter Left Element ("<<head->data<<") :: ";
        cin>>leftElement;
        if(leftElement!=-1){
            Node* tempLeft=newNode(leftElement);
            head->left=tempLeft;
            q.push(tempLeft);
        }
        int rightElement;
        cout<<"Enter Right Element ("<<head->data<<") :: ";
        cin>>rightElement;
        if(rightElement!=-1){
            Node* tempRight=newNode(rightElement);
            head->right=tempRight;
            q.push(tempRight);
        }
        q.pop();
    }
    return root;
}

Node* createTreeDFS(){
    int data;
    cout<<"Enter Node Value ::";
    cin>>data;
    if(data==-1){
        return NULL;
    }
    Node* root=newNode(data);
    //Left 
    cout<<"Enter Left Element ("<<root->data<<")::";  
    root->left=createTreeDFS();
    //Right
    cout<<"Enter Right Element ("<<root->data<<")::";
    root->right=createTreeDFS();
    return root;
}

//Printing
void printTree(Node* root, string indent = "", bool isLeft = true){
    if(root == NULL) return;

    cout << indent;
    if(isLeft){
        cout << "├── ";
        indent += "│   ";
    } else {
        cout << "└── ";
        indent += "    ";
    }
    cout << root->data << endl;

    printTree(root->left, indent, true);
    printTree(root->right, indent, false);
}


//Traversing
void preOrder(Node* root){
    //BaseCase
    if(root==NULL){
        return;
    }
    cout<<root->data<<" ";
    preOrder(root->left);
    preOrder(root->right);
}


int main(){
    int choice=0;

    //INTRO
    
    cout<<"||       This is MENU Driven Tree Mini Project focused on learning Tree for an SDE Role (ALL FROM SCRATCH)      ||\n";
    cout<<"                                                Happy Learning 😁🚀                                             \n \n";
    //MENU 
    cout<<"Menu \n\n";
    cout<<"-1-> EXITING PROGRAM \n";
    cout<<"1-> CREATION OF TREE \n";
    cout<<"2-> TRAVERSAL OF TREE \n\n";
    Node* root=NULL;

    //LOOP START

    //USER Input
   while(choice!=-1){
    cout<<"ENTER YOUR CHOICE :: ";
    cin>>choice;


    //LogicoOfMenu
    if(choice==1){
        cout<<"Let's Create Binary Tree \n";
        cout<<"Method to use ::>> \n\n";
        cout<<" 1->> BFS (Breadth First Search aka Level Order)\n";
        cout<<" 2->> DFS (Depth First Search)\n\n";
        int subChoice;
        cout<<"Enter Method to Use :: ";
        cin>>subChoice;
        
        if(subChoice==1){
            root=createTreeBFS();
            cout<<" (BFS) Binary Tree is Created 😱😱 \n";
        }
        else if(subChoice==2){
            root=createTreeDFS();
            cout<<" (DFS) Binary Tree is Created 😱😱 \n";
        }
        
        
    }
    else if(choice==2){
        if(root == NULL){
            cout << "Tree is empty ❌. Please create tree first.\n";
        } else {
            cout << "Preorder Traversal: ";
            preOrder(root);
            cout << "\n\nTree Structure:\n";
            printTree(root, "", false);
        }
    }
    else if(choice==-1){
        cout<<"Exiting Program 👋\n";
        break;
    }
    else{
        cout<<"INVALID CHOICE ❌ TRY AGAIN \n";
    }
    }
    return 0;

}

