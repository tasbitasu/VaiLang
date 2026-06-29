#pragma once
#include <string>
#include <memory>

// Base Node
struct ASTNode {
    virtual ~ASTNode() = default;
};

// Number Node (e.g., 10, 50)
struct NumberNode : ASTNode {
    int value;
    NumberNode(int v) : value(v) {}
};

// Binary Operation Node (e.g., 10 + 5)
struct BinaryOpNode : ASTNode {
    std::string op;
    std::shared_ptr<ASTNode> left;
    std::shared_ptr<ASTNode> right;
    BinaryOpNode(std::string o, std::shared_ptr<ASTNode> l, std::shared_ptr<ASTNode> r)
        : op(o), left(l), right(r) {}
};

// Print Statement Node
struct PrintNode : ASTNode {
    std::shared_ptr<ASTNode> expression;
    PrintNode(std::shared_ptr<ASTNode> expr) : expression(expr) {}
};