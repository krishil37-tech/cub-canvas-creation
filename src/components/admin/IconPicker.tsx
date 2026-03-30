import {
  BookOpen, GraduationCap, Trophy, Award, Star, Heart, Shield, Users,
  Palette, Music, Brush, Leaf, Globe, Lightbulb, Target, Brain,
  Sparkles, Rocket, Building, School, Crown, Flag, Medal, Gem,
  Puzzle, Shapes, type LucideIcon,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, GraduationCap, Trophy, Award, Star, Heart, Shield, Users,
  Palette, Music, Brush, Leaf, Globe, Lightbulb, Target, Brain,
  Sparkles, Rocket, Building, School, Crown, Flag, Medal, Gem,
  Puzzle, Shapes,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function IconPicker({ value, onChange }: Props) {
  const Icon = ICON_MAP[value] || BookOpen;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {ICON_NAMES.map((name) => {
          const I = ICON_MAP[name];
          return (
            <SelectItem key={name} value={name}>
              <div className="flex items-center gap-2">
                <I className="h-4 w-4" />
                <span>{name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
