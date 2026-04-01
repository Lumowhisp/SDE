#include <iostream>
using namespace std;
int factorial(int n){
    //Base Case
    if(n==0){
        return 1;
    }
    return n*factorial(n-1);
}
int main(){
    int res=factorial(10);
    cout<<res;

}