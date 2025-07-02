
# TCP-Based Integer Sorter Server (C++)

This is a simple TCP server written in C++ that accepts `SORT` commands from clients, sorts the provided integers using Merge Sort, and sends back the sorted list.

## 🔧 How it Works

- Connects to `127.0.0.1` on port `8080`.
- Accepts command like:  
  `SORT 9 2 5 1 4`

- Server responds with:  
  `1 2 4 5 9`

## 🚀 Run Instructions

### 🖥️ Compile:
```bash
g++ server.cpp -o server
```

### 🟢 Run:
```bash
./server
```

## 🧪 Test Using netcat (or write your own client)
```bash
nc 127.0.0.1 8080
SORT 8 4 2 9 5
```

## 📜 Features

- TCP socket communication
- Merge Sort implementation
- Command parsing using `stringstream`
