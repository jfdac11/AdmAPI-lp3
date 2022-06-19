module.exports = function (app) {
  app.models.Admin.observe("after save", function (ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        var Role = app.models.Role;
        var RoleMapping = app.models.RoleMapping;

        Role.create(
          {
            name: "admin",
          },
          function (err, role) {
            if (err) console.log(err);

            if (role.id !== undefined) {
              role.principals.create(
                {
                  principalType: RoleMapping.USER,
                  principalId: ctx.instance.id,
                },
                function (err, principal) {
                  console.log(err);
                }
              );
            } else {
              Role.findOne({ where: { name: "admin" } })
                .then(function (res) {
                  RoleMapping.create(
                    {
                      principalType: "USER",
                      principalId: ctx.instance.id,
                      roleId: res.id,
                    },
                    function (err, roleMapping) {
                      if (err) {
                        return console.log(err);
                      }
                    }
                  );
                })
                .catch(function (err) {
                  console.log(err);
                });
            }
          }
        );
      }
    }

    next();
  });
};
