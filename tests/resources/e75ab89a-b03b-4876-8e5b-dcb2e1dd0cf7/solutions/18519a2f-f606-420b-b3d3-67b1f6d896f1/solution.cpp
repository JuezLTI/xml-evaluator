#include <iostream>
#include <string>

using namespace std;

int battleOutcome(int num) {
    string numStr = to_string(num);
    string res;
    for(int i = 1; i <= numStr.length(); i++)
    {
        if(numStr[i] != numStr[i-1])
        res += numStr[i] > numStr[i-1] ? numStr[i] : numStr[i-1];
        i++;
    }

    return stoi(res);
}

int main() {
    int number;
    cin>>number;

    cout << battleOutcome(number) << endl;
    
    return 0;
}
