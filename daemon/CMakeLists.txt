
add_executable(daemon daemon.c)

target_link_libraries(daemon ${LWS_DEPS})

target_include_directories(daemon PUBLIC
                          "${PROJECT_SOURCE_DIR}/libwebsockets/build"
                          "${PROJECT_SOURCE_DIR}/libwebsockets/include"
                          "${PROJECT_SOURCE_DIR}/mbedtls/include"
                          "${PROJECT_SOURCE_DIR}/mbedtls/build/include"
                          ) 