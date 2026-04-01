#include <iostream>
using namespace std;
class Node{
    public:
    int data;
    Node* left;
    Node* right;
};

Node* createNode(int val){
    Node* temp=new Node();
    temp->data=val;
    temp->right=NULL;
    temp->left=NULL;
    return temp;
}

void inOrder(Node* root){
    if(root==NULL){
        return;
    }
    inOrder(root->left);
    cout<<root->data<<" "<<endl;
    inOrder(root->right);
}


Node* insertBST(int val,Node* root){
    if(root==NULL){
        root=createNode(val);
    }
    else{
        if(root->data>val){
            root->left=insertBST(val,root->left);
        }
        else{
            root->right=insertBST(val,root->right);
        }
    }
    return root;
}

int main(){
    Node* root=NULL;
    root = insertBST(10, root);
    root = insertBST(5, root);
    root = insertBST(15, root);
    root = insertBST(3, root);
    root = insertBST(7, root);
    inOrder(root);


}