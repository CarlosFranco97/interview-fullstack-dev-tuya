namespace User.Infrastructure.Repositories;

using User.Domain.Repositories;
using UserEntity = Domain.Entities.User;

public class InMemoryUserRepository : IUserRepository
{
    private readonly List<UserEntity> _users = new();

    public Task<UserEntity?> GetByIdAsync(Guid id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        return Task.FromResult(user);
    }

    public Task<UserEntity?> GetByUsernameAsync(string username)
    {
        var user = _users.FirstOrDefault(u => u.Username == username.ToLower());
        return Task.FromResult(user);
    }

    public Task<UserEntity?> GetByEmailAsync(string email)
    {
        var user = _users.FirstOrDefault(u => u.Email == email.ToLower());
        return Task.FromResult(user);
    }

    public Task<IEnumerable<UserEntity>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<UserEntity>>(_users);
    }

    public Task AddAsync(UserEntity user)
    {
        _users.Add(user);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(UserEntity user)
    {
        var existing = _users.FirstOrDefault(u => u.Id == user.Id);
        if (existing != null)
        {
            _users.Remove(existing);
            _users.Add(user);
        }
        return Task.CompletedTask;
    }

    public Task<bool> UsernameExistsAsync(string username)
    {
        return Task.FromResult(_users.Any(u => u.Username == username.ToLower()));
    }

    public Task<bool> EmailExistsAsync(string email)
    {
        return Task.FromResult(_users.Any(u => u.Email == email.ToLower()));
    }
}
