cmake_minimum_required(VERSION 3.10)
project(VaiLang)

set(CMAKE_CXX_STANDARD 17)

# Include directory
include_directories(include)

# Source files
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Create Executable
add_executable(vai ${SOURCES})