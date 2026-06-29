#include "../../include/parser.h"

Parser::Parser(std::vector<Token> t) : tokens(t) {}

Token Parser::current() { return tokens[pos]; }

Token Parser::consume(TokenType type) {
    if (tokens[pos].type == type) return tokens[pos++];
    throw std::runtime_error("Unexpected token");
}

std::vector<std::shared_ptr<ASTNode>> Parser::parse() {
    std::vector<std::shared_ptr<ASTNode>> statements;
    while (current().type != TOKEN_EOF) {
        statements.push_back(parseStatement());
    }
    return statements;
}

std::shared_ptr<ASTNode> Parser::parseStatement() {
    if (current().type == TOKEN_PRINT) {
        consume(TOKEN_PRINT);
        return std::make_shared<PrintNode>(parseExpression());
    }
    return nullptr; 
}

std::shared_ptr<ASTNode> Parser::parseExpression() {
    auto left = parsePrimary();
    while (current().type == TOKEN_PLUS || current().type == TOKEN_MINUS) {
        std::string op = current().value;
        consume(current().type);
        auto right = parsePrimary();
        left = std::make_shared<BinaryOpNode>(op, left, right);
    }
    return left;
}

std::shared_ptr<ASTNode> Parser::parsePrimary() {
    Token t = consume(TOKEN_INT);
    return std::make_shared<NumberNode>(std::stoi(t.value));
}