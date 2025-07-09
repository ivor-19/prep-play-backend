import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID, // 👈 this must match the FK type
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  place_of_assignment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'social_worker'),
    allowNull: false,
    defaultValue: 'social_worker' // Set default role
  },
  condition: {
    type: DataTypes.ENUM('pending', 'approved', 'blocked', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  hooks: {
    beforeCreate: async (user) => { //	Automatically hashes the password when a new user is created
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => { // 	Re-hashes the password if it was changed on update
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

export const ChildSession = sequelize.define('ChildSession', {
  session_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  social_worker_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // References your User model
      key: 'id'
    }
  },
  // child_id: {
  //   type: DataTypes.UUID,
  //   allowNull: false,
  //   references: {
  //     model: 'Children', // Assuming you have a Child model
  //     key: 'id'
  //   }
  // },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  avatar_data: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      head: null,
      hair: null,
    }
  },
  emotional_expression: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      method: null,
      drawing_data: null,
      selected_feelings: [],
      body_map_annotations: []
    }
  },
  session_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'archived'),
    allowNull: false,
    defaultValue: 'in_progress'
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['social_worker_id']
    },
    // {
    //   fields: ['child_id']
    // }
  ],
  hooks: {
    beforeUpdate: (session) => {
      if (session.changed('status') && session.status === 'completed') {
        session.end_time = new Date();
      }
    }
  }
});