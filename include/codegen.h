#pragma once
#include "ast.h"
#include <vector>
#include <memory>

class CodeGenerator {
public:
    void generate(const std::vector<std::shared_ptr<ASTNode>>& ast);
private:
    void generateNode(const std::shared_ptr<ASTNode>& node);
};