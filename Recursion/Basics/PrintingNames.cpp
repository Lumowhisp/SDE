//printing linearly from 1 to N;
#include <iostream>
#include<string>
#include<vector>
using namespace std;
// void print1toN(int n,int i){
//     if(i>n){
//         return;
//     }
//     cout<<i<<endl;
//     return print1toN(n,i+1);
// }

// int sumoffirstN(int n){
//     if(n==0){
//         return 0;
//     }
//     return(n+sumoffirstN(n-1));

// }
void reverseArray(vector<int>& nums,int i,int j){
    if(i>=j){
        return;
    }
    swap(nums[i],nums[j]);
    reverseArray(nums,i+1,j-1);

}
int main(){
    vector<int>nums={5,4,6,7,81,3};
    reverseArray(nums,0,5);
    for(int i=0;i<5;i++){
        cout<<nums[i]<<" ";
    }
}