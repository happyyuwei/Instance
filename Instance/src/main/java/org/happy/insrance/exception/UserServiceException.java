package org.happy.insrance.exception;

/**
 * 所有用户相关的异常
 */
public class UserServiceException extends Exception {


    /**
     * 用户登录异常
     */
    public static class UserLoginException extends UserServiceException{

    }

    /**
     * 用户退出登录异常
     */
    public static class UserLogoutException extends UserServiceException{

    }

    /**
     * 用户无法通过token找到异常
     */
    public static class UserNotFoundByTokenException extends UserServiceException{

    }



}
