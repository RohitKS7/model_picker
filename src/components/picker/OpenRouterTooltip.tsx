interface OpenRouterTooltipProps {
  visible: boolean;
}

export function OpenRouterTooltip({ visible }: OpenRouterTooltipProps) {
  if (!visible) {
    return null;
  }

  return (
    <aside className="rounded-brand border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
      <p className="font-semibold">OpenRouter heads-up</p>
      <p className="mt-1 text-muted-foreground">
        OpenRouter is a routing layer, not a model provider. The model behind your config may change, so verify it in
        your OpenRouter dashboard.
      </p>
    </aside>
  );
}
