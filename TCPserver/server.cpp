
#include<iostream>
#include<sstream>
#include<string>
#include<cstring>
#include<cstdlib>
#include<unistd.h>
#include<vector>
#include<algorithm>
#include<sys/socket.h>
#include<netinet/in.h>
#include<arpa/inet.h>
using namespace std;
const int BUFFER_SIZE = 1024;
void log(const string &message){
       cout << message << endl;
}

void exitWithError(const string &errorMessage){
       perror(("ERROR: " + errorMessage).c_str());
       exit(1);
}

void merge(std::vector<int> &arr, int l, int m, int r)
{
    int n1 = m - l + 1, n2 = r - m;
    std::vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2)
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];

    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(std::vector<int> &arr, int l, int r)
{
    if (l < r)
    {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

// TCP Server Class 

class TcpServer
{
public :
       TcpServer(string ip_address , int port)
       :m_ip_address(ip_address) , m_new_socket(-1), m_port(port), m_socket(-1),
       m_socketAddress_len(sizeof(m_socketAddress))
       {      
              m_socketAddress.sin_family = AF_INET;
              m_socketAddress.sin_port = htons(m_port);
              m_socketAddress.sin_addr.s_addr = inet_addr(m_ip_address.c_str());
              if(startServer() != 0){
                     log("Failed to start server.");
              }
       }
       ~TcpServer(){
              closeServer();
       }
       void startListen(){
              if(listen(m_socket , 20 ) < 0){
                     exitWithError("Socket Listen Failed.");
              }
              log("*** Server is running... ***");
              while(true){
                     log("\n--- Waiting for client ---");
                     acceptConnection(m_new_socket);

                     char buffer[BUFFER_SIZE] = {0};
                     int bytesReceived = recv(m_new_socket, buffer, BUFFER_SIZE, 0);

                     if (bytesReceived < 0)
                     { 
                            exitWithError("Failed to Receive data");
                     }

                     std::string inputStr(buffer);
                     log("Received from client and enter command: " + inputStr);

                     std::stringstream ss(inputStr);
                     std::string command;
                     ss >> command;

                     if (command == "SORT")
                     {
                            log("Command: SORT");
                            std::vector<int> nums;
                            int n;
                            while (ss >> n)
                            {
                                   nums.push_back(n);
                            }

                            mergeSort(nums, 0, nums.size() - 1);
                            std::string sortedStr = vectorToString(nums);

                            send(m_new_socket, sortedStr.c_str(), sortedStr.size(), 0);
                            log("Sent sorted result: " + sortedStr);
                     }
                     else
                     {
                            log("Unknown command: " + command);
                            std::string err = "ERROR: Unknown command.";
                            send(m_new_socket, err.c_str(), err.size(), 0);
                     }

                     close(m_new_socket);
              }
       }
private :
       string m_ip_address;
       int m_port;
       int m_socket ;
       int m_new_socket;
       struct sockaddr_in m_socketAddress;
       socklen_t m_socketAddress_len;

       int startServer(){
              m_socket = socket(AF_INET, SOCK_STREAM , 0);
              if(m_socket <0){
                     exitWithError("Cannot Create Socket");
              }
              int opt = 1;
              if(setsockopt(m_socket , SOL_SOCKET, SO_REUSEADDR, &opt , sizeof(opt))< 0){
                     exitWithError("SetSockOpt Failed");
              }
              if(bind(m_socket , (struct sockaddr *)&m_socketAddress, m_socketAddress_len) < 0){
                     exitWithError("Cannot Bind socket to address");
              }
              return 0;
       }

       void closeServer(){
              close(m_socket);
              close(m_new_socket);
              exit(0);
       }
       void acceptConnection(int &new_socket){
              new_socket = accept(m_socket, (struct sockaddr *)&m_socketAddress , &m_socketAddress_len);
              if(new_socket < 0 ){
                     exitWithError("Accept Failed");
              }
       }
       vector<int> parseInput(const string &str){
              stringstream ss(str);
              vector<int>nums;
              int n;
              while(ss >> n ){
                     nums.push_back(n);
              }
              return nums;
       }
       string vectorToString(const vector<int> &vec){
              ostringstream ss;
              for(int n : vec){
                     ss << n << " ";
              }
              return ss.str();
       }
};

int main()
{
    TcpServer server("127.0.0.1", 8080);
    server.startListen();
    return 0;
}

