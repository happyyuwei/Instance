package org.happy.insrance.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletResponse;

/**
 * 统一异常处理
 */
//@ControllerAdvice
public class UniversalExceptionHandler {
    

//    @ExceptionHandler(value = Exception.class)
    public void handleException(HttpServletResponse response){

    }

}
