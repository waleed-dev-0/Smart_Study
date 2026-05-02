export const mockAuth = (req, res, next) => {
  req.user = {
    _id: "aaaaaaaaaaaaaaaaaaaa1",
    username: "test_account",
    email: "test@gmail.com",
  };
  next();
};
