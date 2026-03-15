#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(NULL) {}
};

bool cycleDetect(Node* head){
    // 1. Used || instead of && to prevent a segfault when head is NULL
    if(head==NULL || head->next==NULL){
        return false;
    }
    
    Node* slow=head;
    Node* fast=head;
    
    // 2. Changed condition to prevent errors if fast becomes NULL
    while(fast != NULL && fast->next != NULL){
        slow=slow->next;
        fast=fast->next->next;
        
        // 3. Used == instead of = (assignment operator)
        if(slow == fast){
            return true;
        }
    }
    
    return false;
}

int main(){
    // Test case setup
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = head->next; // Creates a cycle

    if (cycleDetect(head)) {
        cout << "Cycle detected!" << endl;
    } else {
        cout << "No cycle." << endl;
    }

    return 0;
}