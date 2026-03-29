# Contributing to GuardClaw

GuardClaw is open source, free forever, and built in public.

This project exists to help people solve real OpenClaw problems without paywalls, dark patterns, or needless complexity. If you want to improve a tool, sharpen a recommendation, fix a bug, or make the experience easier to trust, your contribution is welcome.

## 1. Why Contribute to GuardClaw?

GuardClaw tools are built around a simple idea: the best tools come from real pain points.

You might contribute because you:

- Found a bug or a confusing edge case
- Want to improve recommendation logic, model coverage, or price estimates
- Care about clearer UX, better copy, or stronger accessibility
- Want to add a new GuardClaw tool for a problem the community keeps hitting
- Believe useful infrastructure should stay open and usable by everyone

We value contributions that make the tool more honest, more practical, and easier to use.

## 2. Development Setup

GuardClaw tools are built with:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

The codebase is organized around a few clear paths:

- `src/components/` for reusable UI
- `src/data/` for hardcoded product data, defaults, pricing, and decision rules
- `src/utils/` for calculation, formatting, and URL state helpers

To get started:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy any required environment values from `.env.example` if the tool uses them.
4. Start the local app with `npm run dev`.

If you are adding a new tool or extending an existing one, prefer small, focused changes that fit the current structure instead of introducing extra abstraction too early.

## 3. Run Locally

Use the standard Next.js workflow:

```bash
npm install
npm run dev
```

Then open the local development URL shown in the terminal.

For production checks:

```bash
npm run build
npm run start
```

If the project exposes linting in your branch, run:

```bash
npm run lint
```

## 4. Code Style and Conventions

Keep the codebase intentional and easy to read.

General conventions:

- Use TypeScript for all new code
- Follow Next.js App Router patterns for routes, layouts, and page-level composition
- Keep components small and purposeful
- Put reusable UI in `src/components/`
- Put product data and hardcoded rules in `src/data/`
- Put pure calculation or state helpers in `src/utils/`
- Prefer clear names over clever shortcuts
- Keep UI minimal, editorial, and problem-first

Design system conventions:

- Use CSS tokens for colors
- Avoid raw hex values
- Use `Lora` for headings and `Source Sans 3` for body text
- Keep spacing, motion, and accents restrained
- Prioritize clarity over decoration

When writing UI copy, speak directly to the user. GuardClaw is not trying to sound corporate, abstract, or generic. It should sound like a tool built by someone who has felt the problem firsthand.

## 5. Submitting Changes

Please work through a normal fork-and-branch flow.

1. Fork the repository if needed.
2. Create a branch for your change.
3. Make the smallest change that solves the problem well.
4. Keep commits focused and easy to review.
5. Open a pull request with a clear description of what changed and why.

Good pull requests usually include:

- A short summary of the user problem
- The change made to address it
- Any assumptions or tradeoffs
- Screenshots or short notes if the UI changed

If your change affects recommendations, pricing, or decision rules, explain the rule change clearly. Those are product decisions, not just implementation details.

## 6. Testing Before You Submit

Before opening a PR, please verify the tool still behaves correctly.

At minimum:

- Run the app locally and click through the main user flow
- Check the relevant route or routes affected by your change
- Confirm the UI still renders correctly on mobile and desktop
- Run `npm run build`
- Run `npm run lint` if available in the project

If you changed recommendation logic, pricing data, or calculator formulas, test a few representative inputs and make sure the outputs still make sense.

If you changed copy, layout, or motion, check that the page still feels intentional and readable rather than crowded or generic.

## 7. Recognition

GuardClaw is built in public, and contributors deserve to be seen.

We aim to recognize contributors through:

- Pull request credit
- Issue references when relevant
- Public thanks in the project narrative when a contribution meaningfully improves the tool

If you want attribution, say so in your PR description or related issue. We’re happy to give credit where it’s due.

## House Rule

If a change makes the tool harder to trust, harder to understand, or harder to use, it probably needs one more pass.

GuardClaw should stay open source, free forever, and honest about what it does.

