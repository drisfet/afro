# Best Practices Guide

This document outlines the best practices followed in the Afro e-commerce platform.

## Code Organization

### Directory Structure
```
✓ Logical grouping by feature
✓ Clear separation of concerns
✓ Consistent naming conventions
✓ Flat hierarchy where possible
```

### File Naming
```
✓ PascalCase for components: Button.tsx
✓ camelCase for utilities: formatPrice.ts
✓ kebab-case for config: next.config.js
✓ Descriptive names: UserProfile.tsx not UP.tsx
```

## TypeScript Best Practices

### Type Safety
```typescript
// ✓ Good - Explicit types
interface UserProps {
  name: string;
  email: string;
}

// ✗ Bad - Any type
function getUser(): any {
  // ...
}
```

### Interfaces vs Types
```typescript
// ✓ Use interfaces for objects
interface User {
  id: string;
  name: string;
}

// ✓ Use types for unions/intersections
type Status = 'active' | 'inactive';
```

## React Best Practices

### Component Structure
```typescript
// ✓ Good - Functional component with proper typing
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ✗ Bad - No types
export default function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Hooks Usage
```typescript
// ✓ Good - Custom hooks for reusable logic
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  
  return user;
}

// ✓ Good - Proper dependency array
useEffect(() => {
  fetchData();
}, [dependency]);

// ✗ Bad - Missing dependencies
useEffect(() => {
  fetchData(id); // id not in dependency array
}, []);
```

### Component Composition
```typescript
// ✓ Good - Small, focused components
function UserCard({ user }: { user: User }) {
  return (
    <div>
      <UserAvatar user={user} />
      <UserInfo user={user} />
    </div>
  );
}

// ✗ Bad - Monolithic component
function UserCard({ user }) {
  return (
    <div>
      {/* 200 lines of JSX */}
    </div>
  );
}
```

## State Management

### Local vs Global State
```typescript
// ✓ Good - Local state for component-specific data
function Form() {
  const [formData, setFormData] = useState({});
  // ...
}

// ✓ Good - Context/Query for shared data
const { data: user } = useUser();
```

### State Updates
```typescript
// ✓ Good - Functional updates
setCount(prev => prev + 1);

// ✗ Bad - Direct state mutation
count++; // Never mutate state directly
```

## API Integration

### Error Handling
```typescript
// ✓ Good - Proper error handling
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed to fetch:', error);
  setError(error.message);
}

// ✗ Bad - No error handling
const data = await fetchData();
setData(data);
```

### Loading States
```typescript
// ✓ Good - Show loading state
function UserList() {
  const { data, isLoading, error } = useUsers();
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  return <List data={data} />;
}
```

## Styling Best Practices

### Tailwind CSS
```typescript
// ✓ Good - Utility classes
<button className="px-4 py-2 bg-blue-600 text-white rounded">
  Click me
</button>

// ✓ Good - Conditional classes with clsx
<button className={clsx(
  'px-4 py-2 rounded',
  isActive ? 'bg-blue-600' : 'bg-gray-400'
)}>
  Click me
</button>

// ✗ Bad - Inline styles
<button style={{ padding: '8px 16px', background: 'blue' }}>
  Click me
</button>
```

### Responsive Design
```typescript
// ✓ Good - Mobile-first approach
<div className="flex flex-col md:flex-row">
  {/* Content */}
</div>

// ✓ Good - Responsive sizing
<img className="w-full md:w-1/2 lg:w-1/3" />
```

## Performance Optimization

### Image Optimization
```typescript
// ✓ Good - Next.js Image component
import Image from 'next/image';

<Image 
  src="/photo.jpg" 
  width={500} 
  height={300}
  alt="Description"
/>

// ✗ Bad - Regular img tag
<img src="/photo.jpg" />
```

### Code Splitting
```typescript
// ✓ Good - Dynamic imports
const DynamicComponent = dynamic(() => import('./Heavy'));

// ✓ Good - Lazy loading
const LazyComponent = lazy(() => import('./Component'));
```

### Memoization
```typescript
// ✓ Good - Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✓ Good - Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## Security Best Practices

### Environment Variables
```typescript
// ✓ Good - Use environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✗ Bad - Hardcoded values
const apiUrl = 'https://api.example.com';
```

### Input Validation
```typescript
// ✓ Good - Validate user input
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ✓ Good - Sanitize before use
const sanitized = DOMPurify.sanitize(userInput);
```

### XSS Prevention
```typescript
// ✓ Good - React auto-escapes
<div>{userInput}</div>

// ✗ Bad - Dangerous HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## Testing Best Practices

### Unit Tests
```typescript
// ✓ Good - Test utility functions
describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(1000, 'USD')).toBe('$10.00');
  });
});
```

### Component Tests
```typescript
// ✓ Good - Test user interactions
describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Git Best Practices

### Commit Messages
```
✓ Good:
- Add user authentication
- Fix cart calculation bug
- Update README with setup instructions

✗ Bad:
- fixed stuff
- updates
- WIP
```

### Branch Naming
```
✓ Good:
- feature/user-authentication
- fix/cart-calculation
- refactor/header-component

✗ Bad:
- new-stuff
- branch1
- temp
```

## Documentation Best Practices

### Code Comments
```typescript
// ✓ Good - Explain why, not what
// Use exponential backoff to avoid rate limiting
await retry(() => fetchData(), { delay: 1000 });

// ✗ Bad - Obvious comments
// Increment count by 1
count++;
```

### Function Documentation
```typescript
// ✓ Good - Document complex functions
/**
 * Calculates shipping cost based on weight and distance
 * @param weight - Package weight in kg
 * @param distance - Shipping distance in km
 * @returns Shipping cost in cents
 */
function calculateShipping(weight: number, distance: number): number {
  // ...
}
```

## Database Best Practices

### Indexing
```sql
-- ✓ Good - Index frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_status ON orders(status);
```

### Queries
```typescript
// ✓ Good - Use ORM efficiently
const users = await userRepository.find({
  where: { status: 'active' },
  take: 10,
});

// ✗ Bad - N+1 query problem
for (const user of users) {
  const orders = await getOrders(user.id);
}

// ✓ Good - Use joins
const users = await userRepository.find({
  relations: ['orders'],
});
```

## Error Handling

### User-Friendly Errors
```typescript
// ✓ Good - Helpful error messages
if (!email) {
  throw new Error('Email is required');
}

// ✗ Bad - Cryptic errors
if (!email) {
  throw new Error('ERR_001');
}
```

### Error Boundaries
```typescript
// ✓ Good - Catch React errors
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Accessibility

### Semantic HTML
```typescript
// ✓ Good - Semantic elements
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ✗ Bad - Generic divs
<div>
  <div>
    <div><a href="/">Home</a></div>
  </div>
</div>
```

### ARIA Labels
```typescript
// ✓ Good - Descriptive labels
<button aria-label="Close dialog">
  <X />
</button>

// ✓ Good - Alt text for images
<img src="photo.jpg" alt="User profile photo" />
```

## Conclusion

Following these best practices will result in:
- More maintainable code
- Better performance
- Improved security
- Enhanced user experience
- Easier collaboration

Remember: **Best practices are guidelines, not rules**. Use judgment and adapt to your specific needs.
