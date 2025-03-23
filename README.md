Core/
├── Entities/               # Các thực thể (models) đại diện cho domain
│   ├── User.cs
│   ├── Order.cs
│   └── Product.cs
├── Interfaces/             # Giao diện (abstractions) cho services/repository
│   ├── IUserService.cs
│   ├── IOrderService.cs
│   └── IRepository.cs
├── Services/               # Logic nghiệp vụ (business logic)
│   ├── UserService.cs
│   ├── OrderService.cs
│   └── ProductService.cs
├── DTOs/                   # Data Transfer Objects (đối tượng truyền dữ liệu)
│   ├── UserDto.cs
│   ├── OrderDto.cs
│   └── CreateUserRequest.cs
├── Exceptions/             # Các ngoại lệ tùy chỉnh
│   ├── NotFoundException.cs
│   └── ValidationException.cs
├── Enums/                  # Các enum (nếu có)
│   └── OrderStatus.cs
└── Utilities/              # Các tiện ích chung (nếu cần)
    └── StringHelper.cs