export async function register() {
    let hasInit = false

    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { executeTaskByInterval } = await import('@/app/be/services/store-procedure')
        if (!hasInit) {
            executeTaskByInterval()
            hasInit = true
        }
    }
}