## DevTinder Api
authRouter
- post /signup
- post /login
- post  /logout

## profileRouter
- patch /profile/edit
- get /profile/view
- patch /profile/password

## connectionRequestRouter
- post /request/send/interested/:userId
- post /request/send/ignored/:userId
- post /request/review/accepted/:requestId
- post /request/review/rejected/:requestId

## userRouter
- get /connections
- get /request/received
- get /feed