﻿using Core.Shared.Entities;

namespace Core.Modules.Auth.Entities
{
    public class Role : ChangeableEntity<int>
    {
        public string Name { get; set; }
        // Rela
        public List<UserRole> UserRoles { get; set; }
    }
}
