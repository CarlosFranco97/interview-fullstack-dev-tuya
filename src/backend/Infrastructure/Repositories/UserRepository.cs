namespace Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using User.Domain.Repositories;
using UserEntity = User.Domain.Entities.User;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserEntity?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<UserEntity?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username.ToLower());
    }

    public async Task<UserEntity?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.ToLower();
        return await _context.Users
            .FirstOrDefaultAsync(u => EF.Property<string>(u, "_email") == normalizedEmail);
    }

    public async Task<IEnumerable<UserEntity>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task AddAsync(UserEntity user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserEntity user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username.ToLower());
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var normalizedEmail = email.ToLower();
        return await _context.Users.AnyAsync(u => EF.Property<string>(u, "_email") == normalizedEmail);
    }
}
