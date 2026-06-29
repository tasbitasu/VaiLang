#include "../../include/codegen.h"
#include <iostream>

// VaiLang → C++ Transpiler
void CodeGenerator::generate(const std::vector<std::shared_ptr<ASTNode>>& ast) {
    std::cout << "#include <iostream>\n";
    std::cout << "int main() {\n";
    
    for (const auto& node : ast) {
        generateNode(node);
    }

    std::cout << "    return 0;\n";
    std::cout << "}\n";
}

void CodeGenerator::generateNode(const std::shared_ptr<ASTNode>& node) {
    if (auto print = std::dynamic_pointer_cast<PrintNode>(node)) {
        std::cout << "    std::cout << ";
        generateNode(print->expression);
        std::cout << " << std::endl;\n";
    } 
    else if (auto binOp = std::dynamic_pointer_cast<BinaryOpNode>(node)) {
        generateNode(binOp->left);
        std::cout << " " << binOp->op << " ";
        generateNode(binOp->right);
    } 
    else if (auto num = std::dynamic_pointer_cast<NumberNode>(node)) {
        std::cout << num->value;
    }
}