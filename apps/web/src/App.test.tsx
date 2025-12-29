import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'


describe('App', () => {
    it('renders login heading by default', () => {
        render(<App />)
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    })
})
