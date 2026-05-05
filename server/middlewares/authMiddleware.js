export const mockAuth = (req, res, next) => {
  req.user = {
    _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
    username: "test_account",
    email: "test@gmail.com",
  };
  next();
};
