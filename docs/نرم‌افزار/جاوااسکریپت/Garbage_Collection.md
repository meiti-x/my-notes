In software engineering, _garbage_ refers to variables and references that are no longer in use. These leftover values still take up memory and should be cleaned up, either manually (in low-level languages like C or C++) or automatically (in higher-level languages like JavaScript).

JavaScript handles memory automatically through a built-in process called **garbage collection**. As a developer, you don’t need to explicitly free memory, but understanding how the garbage collector works can help you avoid memory leaks and write more efficient, performant code.

JavaScript memory is divided into two main regions: the stack and the heap. The stack is where primitive values like numbers, booleans, null, undefined, and symbols are stored. It’s fast and automatically cleaned up when a function finishes executing. The heap, on the other hand, is used for storing objects and functions. This is where garbage collection takes place, because heap memory is dynamic and sticks around until the runtime determines it’s no longer needed.

## How Garbage Collection Works in JS
V8  use a strategy called **generational garbage collection**. This approach is based on the observation that most objects die young — meaning they are created and discarded quickly. So, the heap is split into two regions: the young generation and the old generation.

The young generation, often called the nursery, is where newly created objects live. This area is scanned frequently and collected using a copying algorithm. When collection happens, only the live objects are copied to a new space, and the rest are discarded. This makes collection fast and naturally compacts memory, as live objects are packed together.

If an object survives several rounds of garbage collection in the young generation, it gets promoted to the old generation. This region is scanned less frequently and cleaned up using a **mark-sweep-compact** algorithm. First, the runtime marks all reachable objects. Then, it sweeps away the unreachable ones. If there’s significant memory fragmentation, it may also compact the memory by moving live objects around to make allocation more efficient.

While some phases of garbage collection are non-blocking — such as marking, which can happen asynchronously — others are not. **Sweeping** and **compacting** are **Stop-The-World (STW)** operations. That means JavaScript execution is paused entirely while the garbage collector frees memory or rearranges the heap. This can lead to small but noticeable delays, especially in memory-heavy applications or those with poor memory hygiene.

To reduce the chances of hitting performance problems, it’s important to write code that doesn’t hold onto memory unnecessarily.

## Conculosion:  Writing GC-Friendly JavaScript
- **Avoid global variables**: Global state lives throughout the app’s lifetime and can’t be garbage collected easily.
    
- **Be cautious with closures**: If a closure holds references to large or stale data, it can prevent that memory from being released.
    
- **Clean up timers**: Always call `clearTimeout` or `clearInterval` when they're no longer needed.
    
- **Don’t overuse React Context**: Passing large objects through context can cause them to linger in memory longer than necessary.
    
- **Unsubscribe from subscriptions and event listeners**: If your component sets up a listener or subscribes to an external API (like `WebSocket`, `ResizeObserver`, or a store), always clean it up during unmount.
    
### Monitoring Tools
- **DevTools Memory tab**: Take heap snapshots, find detached nodes, and inspect retained memory.
- **DevTools Performance tab**: Record CPU + memory usage and look for GC spikes or long STW pauses.
- **`console.memory`**: Check memory usage in Chrome at runtime. Not precise, but useful for tracking trends.


part 2 
weakmap/weak set