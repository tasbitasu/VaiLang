#include "../../include/lexer.h"
#include <cctype>

Lexer::Lexer(std::string source) : src(source) {}

char Lexer::peek() { return (pos < src.length()) ? src[pos] : '\0'; }
char Lexer::advance() { return src[pos++]; }

std::vector<Token> Lexer::tokenize() {
    std::vector<Token> tokens;
    while (pos < src.length()) {
        char current = peek();

        if (isspace(current)) {
            advance();
        } else if (isdigit(current)) {
            std::string numStr;
            while (isdigit(peek())) numStr += advance();
            tokens.push_back({TOKEN_INT, numStr});
        } else if (isalpha(current)) {
            std::string word;
            while (isalpha(peek())) word += advance();
            if (word == "print") tokens.push_back({TOKEN_PRINT, word});
        } else if (current == '+') {
            tokens.push_back({TOKEN_PLUS, "+"}); advance();
        } else if (current == '-') {
            tokens.push_back({TOKEN_MINUS, "-"}); advance();
        } else {
            advance(); // Skip unknown
        }
    }
    tokens.push_back({TOKEN_EOF, ""});
    return tokens;
}