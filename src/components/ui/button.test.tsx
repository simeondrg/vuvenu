/**
 * Tests du composant Button
 *
 * Tests pour components/ui/button.tsx - composant button de base
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

// =============================================
// TESTS: Button Component
// =============================================

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('should render button with default variant and size', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
      expect(button).toHaveClass('h-10', 'px-4', 'py-2')
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('border', 'border-input', 'bg-background')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
    })

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('text-primary', 'underline-offset-4')
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-9', 'px-3')
    })

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-11', 'px-8')
    })

    it('should render icon size', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('should be enabled by default', () => {
      render(<Button>Enabled</Button>)
      const button = screen.getByRole('button')

      expect(button).toBeEnabled()
    })
  })

  describe('Events', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')

      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger click when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      )
      const button = screen.getByRole('button')

      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should handle keyboard events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Keyboard</Button>)
      const button = screen.getByRole('button')

      // Focus sur le bouton puis appui sur Enter
      button.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should be focusable', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')

      button.focus()
      expect(button).toHaveFocus()
    })

    it('should support aria-label', () => {
      render(<Button aria-label="Custom label">Icon</Button>)
      const button = screen.getByRole('button', { name: /custom label/i })

      expect(button).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(
        <>
          <Button aria-describedby="help-text">Help</Button>
          <div id="help-text">This is help text</div>
        </>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })
  })

  describe('Content', () => {
    it('should render text content', () => {
      render(<Button>Text content</Button>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render with icon and text', () => {
      render(
        <Button>
          <span data-testid="icon">🏠</span>
          Home
        </Button>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('should handle empty content', () => {
      render(<Button></Button>)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML button attributes', () => {
      render(
        <Button
          type="submit"
          form="test-form"
          name="submit-btn"
          value="submit"
        >
          Submit
        </Button>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('name', 'submit-btn')
      expect(button).toHaveAttribute('value', 'submit')
    })

    it('should support data attributes', () => {
      render(
        <Button data-testid="custom-button" data-analytics="track-click">
          Track me
        </Button>
      )
      const button = screen.getByTestId('custom-button')

      expect(button).toHaveAttribute('data-analytics', 'track-click')
    })
  })

  describe('Ref forwarding', () => {
    it('should forward ref to button element', () => {
      let buttonRef: HTMLButtonElement | null = null

      render(
        <Button ref={(el) => { buttonRef = el }}>
          Ref test
        </Button>
      )

      expect(buttonRef).toBeInstanceOf(HTMLButtonElement)
      expect(buttonRef).not.toBeNull()
    })
  })
})