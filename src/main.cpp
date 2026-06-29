#include <iostream>
#include <fstream>
#include <sstream>
#include "../include/lexer.h"
#include "../include/parser.h"
#include "../include/codegen.h"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: vai <file.vai>" << std::endl;
        return 1;
    }

    // 1. Read File
    std::ifstream file(argv[1]);
    if (!file) {
        std::cerr << "Error: Could not open file " << argv[1] << std::endl;
        return 1;
    }
    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string source = buffer.str();

    // 2. Lexer
    Lexer lexer(source);
    std::vector<Token> tokens = lexer.tokenize();

    // 3. Parser
    Parser parser(tokens);
    auto ast = parser.parse();

    // 4. Code Generator (Outputs C++ code to stdout)
    CodeGenerator generator;
    generator.generate(ast);

    return 0;
}