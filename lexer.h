#pragma once
#include <string>
#include <vector>
#include <iostream>

enum TokenType { TOKEN_INT, TOKEN_PLUS, TOKEN_MINUS, TOKEN_PRINT, TOKEN_EOF };

struct Token {
    TokenType type;
    std::string value;
};

class Lexer {
public:
    Lexer(std::string source);
    std::vector<Token> tokenize();
private:
    std::string src;
    size_t pos = 0;
    char peek();
    char advance();
};