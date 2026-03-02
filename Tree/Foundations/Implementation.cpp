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
int main(){
    cout<<"||       This is MENU Driven Tree Mini Project focused on learning Tree for an SDE Role (ALL FROM SCRATCH)      ||\n";
    cout<<"                                                Happy Learning 😁🚀                                             \n \n";
    cout<<"Menu \n";
    cout<<"1-> CREATION OF TREE \n";
    

    //USER Input
    int choice;
    cout<<"ENTER YOUR CHOICE :: ";
    cin>>choice;

    //LogicofMenu
    if(choice==1){
        cout<<"Let's Create Binary Tree \n";
        Node* root=createTreeBFS();
        cout<<"  Binary Tree is Created 😱😱 ";
    }
    return 0;
  
}

