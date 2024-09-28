import PersonInfo from "../models/person-info";
import { sequelize } from "../configs/db";
import Role from "../models/role";
import User from "../models/user";
import bcrypt from "bcrypt";

const initRolesAndAdminUser = async () => {
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Create roles - 'admin' and 'user'
    const [adminRole, userRole] = await Promise.all([
      Role.findOrCreate({
        where: { role_name: "admin" },
        defaults: {
          role_name: "admin",
          description: "Administrator Role",
          created_by: "system",
          created_at: new Date(),
        } as any,
        transaction,
      }),
      Role.findOrCreate({
        where: { role_name: "user" },
        defaults: {
          role_name: "user",
          description: "Regular User Role",
          created_by: "system",
          created_at: new Date(),
        } as any,
        transaction,
      }),
    ]);

    // Step 2: Create an admin user
    let adminUser = await User.findOne({
      where: { username: "admin" },
      transaction,
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin_password", 10); // Use a secure password

      // Create the PersonInfo entry for the admin
      const personInfo = await PersonInfo.create(
        {
          first_name: "Admin",
          last_name: "User",
          dob: new Date(1990, 0, 1), // Example DOB
          phone_number: "1234567890",
          email: "admin@example.com",
          gender: "other",
          religion: "none",
          created_by: "system",
        },
        { transaction }
      );

      // Create the admin user
      adminUser = await User.create(
        {
          username: "admin",
          password: hashedPassword,
          person_id: personInfo.id,
          role_id: adminRole[0].id, // Assign the admin role (adminRole[0] contains the Role instance)
          is_active: true,
          created_by: "system",
        },
        { transaction }
      );

      console.log(
        "[INFO] Admin user created successfully. Username: 'admin', Password: 'admin_password'"
      );
    } else {
      console.log("[INFO] Admin user already exists. Username: 'admin'");
    }

    // Commit the transaction if everything is fine
    await transaction.commit();
    console.log("[INFO] Roles and admin user created successfully.");
  } catch (error) {
    // Rollback the transaction in case of errors
    await transaction.rollback();
    console.error("Error initializing roles and admin user:", error);
  }
};

// Execute the script
initRolesAndAdminUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
