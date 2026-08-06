import { Text } from 'react-native';

export default function MarkdownText({ text, style, boldStyle }) {
  if (!text) return null;

  const lines = String(text).split('\n');

  return (
    <Text style={style}>
      {lines.map((line, lineIndex) => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);

        return (
          <Text key={lineIndex}>
            {parts.map((part, partIndex) => {
              const isBold = part.startsWith('**') && part.endsWith('**');
              const content = isBold ? part.slice(2, -2) : part;

              return (
                <Text
                  key={partIndex}
                  style={isBold ? [{ fontWeight: '700' }, boldStyle] : undefined}
                >
                  {content}
                </Text>
              );
            })}
            {lineIndex < lines.length - 1 ? '\n' : ''}
          </Text>
        );
      })}
    </Text>
  );
}