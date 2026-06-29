#pragma once
#include "lexer.h"
#include "ast.h"
#include <vector>
#include <memory>

class Parser {
public:
    Parser(std::vector<Token> tokens);
    std::vector<std::shared_ptr<ASTNode>> parse();
private:
    std::vector<Token> tokens;
    size_t pos = 0;
    Token current();
    Token consume(TokenType type);
    
    std::shared_ptr<ASTNode> parseStatement();
    std::shared_ptr<ASTNode> parseExpression();
    std::shared_ptr<ASTNode> parsePrimary();
};