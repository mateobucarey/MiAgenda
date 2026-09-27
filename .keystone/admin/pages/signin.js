import makeSigninPage from '@keystone-6/auth/pages/SigninPage'

export default makeSigninPage({"authGqlNames":{"itemQueryName":"user","whereUniqueInputName":"UserWhereUniqueInput","authenticateItemWithPassword":"authenticateUserWithPassword","ItemAuthenticationWithPasswordResult":"UserAuthenticationWithPasswordResult","ItemAuthenticationWithPasswordSuccess":"UserAuthenticationWithPasswordSuccess","ItemAuthenticationWithPasswordFailure":"UserAuthenticationWithPasswordFailure"},"identityField":"email","secretField":"password"})
