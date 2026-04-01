#include <iostream>
using namespace std;
//Checking even and odd
void isEven(int n){
    if((n & 1) == 0){
        cout << n << " is Even" << endl;
    }
    else{
        cout << n << " is Odd" << endl;
    }
    return;
}
void ithBit(int n,int bit){
    int ans= ((n>>(bit-1))&1);
    cout<<bit<<"th bit in "<<n<<" is "<<ans;
    return;
}
void setithBit(int n,int bit){
    int ans=(n|(1<<(bit-1)));
    cout<<"Setted "<<bit<< " bit "<<ans;
    return;
}
void removeithBit(int n,int bit){
    int ans=(n&~(1<<(bit-1)));
    cout<<"Removed "<<bit<< " bit "<<ans;
    return;
}
int main(){
    int choice;
    cout<<"Menu\n"<<" 1 => Checking a Number Even / Odd"<<endl;
    cout<<" 2 =>Finding ith Bit"<<endl;
    cout<<" 3 =>Set ith Bit"<<endl;
    cout << " 4 => Remove ith Bit" << endl;
    cout<<"Enter Choice:";
    cin>>choice;
    if(choice==1){
        int n;
        cout<<"Enter Number:";
        cin>>n;
        isEven(n);
    }
    else if(choice==2){
        int n;
        cout<<"Enter Number:";
        cin>>n;
        cout<<"Enter bit to find:";
        int bit;
        cin>>bit;
        ithBit(n,bit);
    }
    else if(choice==3){
        int n;
        cout<<"Enter Number:";
        cin>>n;
        cout<<"Enter bit to set:";
        int bit;
        cin>>bit;
        setithBit(n,bit);
    }
    else if(choice==4){
        int n;
        cout<<"Enter Number:";
        cin>>n;
        cout<<"Enter bit to remove:";
        int bit;
        cin>>bit;
        removeithBit(n,bit);
    }
}