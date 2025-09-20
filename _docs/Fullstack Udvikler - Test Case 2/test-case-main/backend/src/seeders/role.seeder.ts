import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../users/entities/role.entity';
import { SystemRoles } from '../users/enums';

export class RoleSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roles: Role[] = [];

    // Create system roles
    const roleDefinitions = [
      {
        code: SystemRoles.ADMIN,
        name: 'Administrator',
        description: 'Full system access with administrative privileges'
      },
      {
        code: SystemRoles.MANAGER,
        name: 'Manager',
        description: 'Management level access with team oversight capabilities'
      },
      {
        code: SystemRoles.LEARNER,
        name: 'Learner',
        description: 'Standard user access for learning and training'
      },
      {
        code: SystemRoles.INSTRUCTOR,
        name: 'Instructor',
        description: 'Access to create and manage training content'
      }
    ];

    for (const def of roleDefinitions) {
      const role = new Role();
      role.code = def.code;
      role.name = def.name;
      role.description = def.description;
      roles.push(role);
    }

    // Persist all roles
    em.persist(roles);
    await em.flush();

    console.log(`✅ Created ${roles.length} roles`);
  }
} 