import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Sparkles, RefreshCw, Wand2, Pencil, Film, Video, Layers, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Image Generation options ──────────────────────────────────────────────────
const imgGenOptions = {
  style: [
    "Photorealistic portrait",
    "Cinematic film still",
    "Editorial fashion",
    "Natural lifestyle",
    "Documentary style",
  ],
  subject: [
    "Young woman (20s)",
    "Young man (20s)",
    "Middle-aged woman (40s)",
    "Middle-aged man (40s)",
    "Elderly woman",
    "Elderly man",
    "Child (8–12)",
  ],
  appearance: [
    "Natural everyday look",
    "Glamorous and polished",
    "Professional business look",
    "Casual and relaxed",
    "Athletic and sporty",
  ],
  clothing: [
    "Smart casual shirt and trousers",
    "Professional business suit",
    "Casual white T-shirt and jeans",
    "Elegant evening dress with natural folds",
    "Traditional ethnic dress with fabric patterns",
    "High-fashion outfit with realistic fabric drape",
  ],
  pose: [
    "Relaxed standing with natural posture",
    "Both hands in pockets",
    "One hand on hip",
    "Arms crossed comfortably",
    "Natural walking pose",
    "Elegant seated pose",
    "Looking slightly away from camera",
  ],
  expression: [
    "Soft friendly smile",
    "Confident and calm",
    "Natural happy expression",
    "Elegant poised expression",
    "Neutral professional expression",
  ],
  background: [
    "Clean neutral indoor wall",
    "Modern office with natural daylight",
    "Luxury hotel lobby",
    "Outdoor park during golden hour",
    "Modern cafe interior",
    "City street at sunset",
    "Formal indoor gala setting",
  ],
  lighting: [
    "Soft natural daylight with gentle shadows",
    "Warm indoor lighting",
    "Golden hour sunlight with soft warm tones",
    "Studio portrait lighting",
    "Cinematic lighting with depth of field",
  ],
  cameraAngle: [
    "Eye level – medium shot",
    "Close-up portrait",
    "Wide establishing shot",
    "Low angle looking up",
    "High angle looking down",
    "Over-the-shoulder",
  ],
  mood: [
    "Bright and uplifting",
    "Dramatic and moody",
    "Soft and romantic",
    "Bold and energetic",
    "Calm and peaceful",
    "Dark and cinematic",
  ],
  aspectRatio: [
    "1:1 Square",
    "16:9 Landscape",
    "9:16 Portrait (vertical)",
    "4:3 Standard",
    "3:4 Portrait",
    "2:3 Vertical",
  ],
};

const imgGenDefault = {
  style: imgGenOptions.style[0],
  subject: imgGenOptions.subject[0],
  appearance: imgGenOptions.appearance[0],
  clothing: imgGenOptions.clothing[0],
  pose: imgGenOptions.pose[0],
  expression: imgGenOptions.expression[0],
  background: imgGenOptions.background[0],
  lighting: imgGenOptions.lighting[0],
  cameraAngle: imgGenOptions.cameraAngle[0],
  mood: imgGenOptions.mood[0],
  aspectRatio: imgGenOptions.aspectRatio[0],
  customDescription: "",
  extraRestrictions: "",
};

// ── Image Editing options ─────────────────────────────────────────────────────
const imgEditOptions = {
  frame: [
    "Keep original frame",
    "Face to upper body",
    "Face to waist-up",
    "Upper body to full body",
    "Full body portrait",
  ],
  bodyAdjust: [
    "No body adjustment",
    "Slightly taller with natural proportions",
    "Slimmer and more toned physique",
    "Fuller, more natural body shape",
    "Better posture and more balanced proportions",
    "Subtle chest / waist / hip balance adjustment",
  ],
  pose: [
    // Professional
    "Professional — Confident standing, one hand on hip",
    "Professional — Arms crossed, authority stance",
    "Professional — Hands clasped in front, formal",
    "Professional — Slight lean forward, engaging",
    // Casual
    "Casual — Relaxed standing, weight on one leg",
    "Casual — Both hands in pockets",
    "Casual — One hand in pocket, natural",
    "Casual — Looking away, natural moment",
    // Social Media / Influencer
    "Influencer — Selfie style, hand raised",
    "Influencer — Over-the-shoulder look",
    "Influencer — Chin touch pose",
    "Influencer — Playful, head tilted",
    // Fashion / Model
    "Fashion — Runway style, one leg forward",
    "Fashion — Hand on hip, body angled sideways",
    "Fashion — Dynamic pose, weight shifted",
    "Fashion — Seated elegant, legs crossed",
    // Party / Event
    "Party — Holding glass, cheerful expression",
    "Party — Light dancing stance",
    "Party — Group-friendly, open posture",
    // Sitting
    "Sitting — Casual, one leg slightly forward",
    "Sitting — Leaning back, arm on surface",
    "Sitting — Crossed legs, elegant",
    // Movement
    "Movement — Walking forward naturally",
    "Movement — Turning motion",
    "Movement — Step and pause, mid-step",
  ],
  clothing: [
    "Keep original outfit",
    "Professional business suit with realistic fabric texture",
    "Casual white T-shirt and blue jeans",
    "Elegant evening dress with natural folds",
    "Traditional Burmese dress with detailed fabric patterns",
    "Smart casual shirt and trousers",
    "High-fashion outfit with realistic fabric drape",
  ],
  makeupStyle: [
    "Keep natural face and makeup",
    "Light natural makeup — soft blush and neutral lips",
    "Elegant evening makeup — smoky eyes and deep rose lipstick",
    "Fresh outdoor makeup — soft blush and natural lip color",
    "Bold glam makeup — defined eyeliner and glossy lips",
    "Nightclub glam — smoky eyes, highlighted cheeks, glossy lips",
    "Formal gala — elegant foundation and rich lipstick tone",
  ],
  faceTreatment: [
    "No face treatment — keep as is",
    "Enhance skin realism — natural texture, pores, subtle imperfections",
    "De-age approximately 10 years — reduce wrinkles, smooth skin subtly",
    "DSLR realism — natural pores, accurate lighting, no airbrushing",
    "Even skin tone — natural and smooth without over-processing",
    "Remove beauty filter — restore natural skin texture and imperfections",
  ],
  expression: [
    "Keep original expression",
    "Soft friendly smile",
    "Confident and calm expression",
    "Natural happy expression with bright eyes",
    "Elegant poised expression",
    "Neutral professional expression",
  ],
  background: [
    "Keep original background",
    "Clean neutral indoor wall",
    "Modern office with natural daylight",
    "Luxury hotel lobby with warm lighting",
    "Outdoor park during golden hour",
    "Modern cafe interior with soft background blur",
    "City street at sunset with cinematic depth of field",
    "Formal indoor party or gala setting",
  ],
  lighting: [
    "Match original lighting, shadows, and perspective",
    "Soft natural daylight with gentle shadows",
    "Warm indoor lighting with realistic shadows",
    "Golden hour sunlight with soft warm tones",
    "Studio portrait lighting with natural skin highlights",
    "Cinematic lighting with realistic depth of field",
  ],
};

const imgEditDefault = {
  frame: imgEditOptions.frame[0],
  bodyAdjust: imgEditOptions.bodyAdjust[0],
  pose: imgEditOptions.pose[0],
  clothing: imgEditOptions.clothing[0],
  makeupStyle: imgEditOptions.makeupStyle[0],
  faceTreatment: imgEditOptions.faceTreatment[0],
  expression: imgEditOptions.expression[0],
  background: imgEditOptions.background[0],
  lighting: imgEditOptions.lighting[0],
  customTask: "",
  extraRestrictions: "",
};

// ── Video Generation (Text) options ──────────────────────────────────────────
const vidTextOptions = {
  duration: ["3–5 seconds", "5–8 seconds", "8–12 seconds", "15–20 seconds"],
  subject: [
    "Person walking through scene",
    "Nature landscape",
    "Urban cityscape",
    "Product showcase",
    "Crowd and street activity",
    "Abstract motion",
  ],
  action: [
    "Walking naturally forward",
    "Turning and looking at camera",
    "Interacting with environment",
    "Standing with subtle idle motion",
    "Running or moving quickly",
  ],
  cameraMove: [
    "Static locked shot",
    "Slow dolly forward",
    "Slow pan left to right",
    "Cinematic truck shot",
    "Slow zoom in",
    "Handheld natural movement",
    "Aerial drone descent",
  ],
  style: [
    "Cinematic film",
    "Documentary realism",
    "Commercial / advertisement",
    "Social media lifestyle",
    "Artistic / experimental",
  ],
  background: [
    "Outdoor park during golden hour",
    "Modern office interior",
    "City street at sunset",
    "Luxury indoor venue",
    "Natural landscape",
    "Abstract minimal background",
  ],
  lighting: [
    "Soft natural daylight",
    "Warm golden hour",
    "Cool overcast daylight",
    "Even studio lighting",
    "Dramatic high-contrast cinematic",
  ],
  mood: [
    "Uplifting and bright",
    "Dramatic and tense",
    "Romantic and soft",
    "Energetic and bold",
    "Calm and serene",
  ],
  aspectRatio: ["16:9 Widescreen", "9:16 Vertical (Reels / TikTok)", "1:1 Square"],
};

const vidTextDefault = {
  duration: vidTextOptions.duration[0],
  subject: vidTextOptions.subject[0],
  action: vidTextOptions.action[0],
  cameraMove: vidTextOptions.cameraMove[0],
  style: vidTextOptions.style[0],
  background: vidTextOptions.background[0],
  lighting: vidTextOptions.lighting[0],
  mood: vidTextOptions.mood[0],
  aspectRatio: vidTextOptions.aspectRatio[0],
  ambientAudio: "",
  customDescription: "",
  extraRestrictions: "",
};

// ── Video Generation (from Photo) options ─────────────────────────────────────
const vidPhotoOptions = {
  duration: ["2–3 seconds", "3–5 seconds", "5–8 seconds"],
  motionType: [
    "Subtle natural breathing only",
    "Hair and clothes gently moving in breeze",
    "Slow confident walk forward",
    "Head turning slightly",
    "Eyes blinking naturally",
    "Subtle smile gradually appearing",
    "Upper body gentle sway",
  ],
  cameraMove: [
    "Static – no camera movement",
    "Slow gentle zoom in",
    "Slow pull back",
    "Subtle drift left",
    "Subtle drift right",
  ],
  animStyle: [
    "Ultra-subtle and lifelike",
    "Smooth cinematic motion",
    "Natural documentary-style",
  ],
  bgMotion: [
    "Keep background completely still",
    "Subtle background bokeh and depth",
    "Gentle background movement (leaves, people)",
    "No background change",
  ],
  lighting: [
    "Keep exact original lighting",
    "Subtle golden hour glow enhancement",
    "Soft natural daylight enhancement",
  ],
  mood: [
    "Peaceful and calm",
    "Confident and strong",
    "Soft and romantic",
    "Natural and candid",
  ],
  aspectRatio: ["16:9 Widescreen", "9:16 Vertical (Reels / TikTok)", "1:1 Square"],
};

const vidPhotoDefault = {
  duration: vidPhotoOptions.duration[1],
  motionType: vidPhotoOptions.motionType[0],
  cameraMove: vidPhotoOptions.cameraMove[0],
  animStyle: vidPhotoOptions.animStyle[0],
  bgMotion: vidPhotoOptions.bgMotion[0],
  lighting: vidPhotoOptions.lighting[0],
  mood: vidPhotoOptions.mood[0],
  aspectRatio: vidPhotoOptions.aspectRatio[0],
  ambientAudio: "",
  customDescription: "",
  extraRestrictions: "",
};

// ── Reference Blend options ───────────────────────────────────────────────────
const refBlendOptions = {
  referenceElement: [
    "Pose only — body position, arms, and legs from Image B",
    "Clothing / Outfit — dress, fabric, and fit from Image B",
    "Background / Environment — scene and setting from Image B",
    "Makeup style — lip color, eyes, and skin finish from Image B",
    "Pose + Clothing — stance and outfit from Image B",
    "Pose + Background — position and environment from Image B",
    "Clothing + Background — outfit and scene from Image B",
    "Full style — pose, outfit, and background from Image B",
  ],
  lighting: [
    "Match lighting direction and color temperature between both images",
    "Keep original lighting conditions from Image A",
    "Apply lighting style and color tone from Image B",
    "Blend lighting naturally from both images",
  ],
};

const refBlendDefault = {
  referenceElement: refBlendOptions.referenceElement[0],
  lighting: refBlendOptions.lighting[0],
  customDescription: "",
  extraRestrictions: "",
};

// ── Combine People options ────────────────────────────────────────────────────
const combineOptions = {
  combineType: [
    "1. Put both people in one image (side by side)",
    "2. Face swap — replace face in A with face from B",
    "3. Apply Person B's pose to Person A",
    "4. Dress Person A in Person B's clothes",
    "5. Both people together with active interaction",
    "6. Place Person A into Person B's background/setting",
    "7. Hybrid / blended face (advanced)",
  ],
  lighting: [
    "Match lighting direction and color temperature between both images",
    "Keep original lighting from Image A",
    "Apply lighting style from Image B",
    "Blend lighting naturally from both images",
  ],
};

const combineDefault = {
  combineType: combineOptions.combineType[0],
  lighting: combineOptions.lighting[0],
  customDescription: "",
  extraRestrictions: "",
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: "imgGen",    label: "Image Generation", sub: "From Text",     Icon: Wand2  },
  { id: "imgEdit",   label: "Image Editing",    sub: "Existing Photo", Icon: Pencil },
  { id: "refBlend",  label: "Reference Blend",  sub: "A + B Images",  Icon: Layers },
  { id: "combine",   label: "Combine People",   sub: "A + B Persons", Icon: Users  },
  { id: "vidText",   label: "Video Generation", sub: "From Text",     Icon: Film   },
  { id: "vidPhoto",  label: "Video Generation", sub: "From Photo",    Icon: Video  },
];

// ── Shared UI components ──────────────────────────────────────────────────────
function SelectBlock({ label, value, onChange, items }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-400"
      >
        {items.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function TextBlock({ label, value, onChange, placeholder, minH = "min-h-20" }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${minH} w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-400`}
      />
    </label>
  );
}

// ── Tab-specific form panels ──────────────────────────────────────────────────
function ImageGenForm({ form, set, opts }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectBlock label="Style" value={form.style} onChange={(v) => set("style", v)} items={opts.style} />
        <SelectBlock label="Camera Angle" value={form.cameraAngle} onChange={(v) => set("cameraAngle", v)} items={opts.cameraAngle} />
        <SelectBlock label="Aspect Ratio" value={form.aspectRatio} onChange={(v) => set("aspectRatio", v)} items={opts.aspectRatio} />
        <SelectBlock label="Subject" value={form.subject} onChange={(v) => set("subject", v)} items={opts.subject} />
        <SelectBlock label="Appearance" value={form.appearance} onChange={(v) => set("appearance", v)} items={opts.appearance} />
        <SelectBlock label="Clothing" value={form.clothing} onChange={(v) => set("clothing", v)} items={opts.clothing} />
        <SelectBlock label="Pose" value={form.pose} onChange={(v) => set("pose", v)} items={opts.pose} />
        <SelectBlock label="Expression" value={form.expression} onChange={(v) => set("expression", v)} items={opts.expression} />
        <SelectBlock label="Mood" value={form.mood} onChange={(v) => set("mood", v)} items={opts.mood} />
        <div className="md:col-span-2">
          <SelectBlock label="Background" value={form.background} onChange={(v) => set("background", v)} items={opts.background} />
        </div>
        <div className="md:col-span-2">
          <SelectBlock label="Lighting" value={form.lighting} onChange={(v) => set("lighting", v)} items={opts.lighting} />
        </div>
      </div>
      <TextBlock
        label="Custom Description"
        value={form.customDescription}
        onChange={(v) => set("customDescription", v)}
        placeholder="Describe the image you want to create in your own words."
        minH="min-h-24"
      />
      <TextBlock
        label="Negative Prompts / Restrictions"
        value={form.extraRestrictions}
        onChange={(v) => set("extraRestrictions", v)}
        placeholder="Example: No text in the image. Keep the color palette warm."
      />
    </>
  );
}

function ImageEditForm({ form, set, opts }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectBlock label="Frame / Body" value={form.frame} onChange={(v) => set("frame", v)} items={opts.frame} />
        <SelectBlock label="Body Adjustment" value={form.bodyAdjust} onChange={(v) => set("bodyAdjust", v)} items={opts.bodyAdjust} />
        <div className="md:col-span-2">
          <SelectBlock label="Pose" value={form.pose} onChange={(v) => set("pose", v)} items={opts.pose} />
        </div>
        <SelectBlock label="Clothing" value={form.clothing} onChange={(v) => set("clothing", v)} items={opts.clothing} />
        <SelectBlock label="Expression" value={form.expression} onChange={(v) => set("expression", v)} items={opts.expression} />
        <SelectBlock label="Makeup Style" value={form.makeupStyle} onChange={(v) => set("makeupStyle", v)} items={opts.makeupStyle} />
        <SelectBlock label="Face Treatment" value={form.faceTreatment} onChange={(v) => set("faceTreatment", v)} items={opts.faceTreatment} />
        <SelectBlock label="Background" value={form.background} onChange={(v) => set("background", v)} items={opts.background} />
        <SelectBlock label="Lighting" value={form.lighting} onChange={(v) => set("lighting", v)} items={opts.lighting} />
      </div>
      <TextBlock
        label="Custom Task"
        value={form.customTask}
        onChange={(v) => set("customTask", v)}
        placeholder="Example: Expand the image from face-only to waist-up and make the face more photorealistic."
        minH="min-h-24"
      />
      <TextBlock
        label="Negative Prompts / Restrictions"
        value={form.extraRestrictions}
        onChange={(v) => set("extraRestrictions", v)}
        placeholder="Example: Keep the same background color. Do not change hair length."
      />
    </>
  );
}

function VideoTextForm({ form, set, opts }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectBlock label="Duration" value={form.duration} onChange={(v) => set("duration", v)} items={opts.duration} />
        <SelectBlock label="Aspect Ratio" value={form.aspectRatio} onChange={(v) => set("aspectRatio", v)} items={opts.aspectRatio} />
        <SelectBlock label="Style" value={form.style} onChange={(v) => set("style", v)} items={opts.style} />
        <SelectBlock label="Subject" value={form.subject} onChange={(v) => set("subject", v)} items={opts.subject} />
        <SelectBlock label="Action" value={form.action} onChange={(v) => set("action", v)} items={opts.action} />
        <SelectBlock label="Camera Movement" value={form.cameraMove} onChange={(v) => set("cameraMove", v)} items={opts.cameraMove} />
        <SelectBlock label="Mood" value={form.mood} onChange={(v) => set("mood", v)} items={opts.mood} />
        <div className="md:col-span-2">
          <SelectBlock label="Background / Setting" value={form.background} onChange={(v) => set("background", v)} items={opts.background} />
        </div>
        <div className="md:col-span-2">
          <SelectBlock label="Lighting" value={form.lighting} onChange={(v) => set("lighting", v)} items={opts.lighting} />
        </div>
      </div>
      <TextBlock
        label="Custom Description"
        value={form.customDescription}
        onChange={(v) => set("customDescription", v)}
        placeholder="Describe what you want the video to look like or what happens in the scene."
        minH="min-h-24"
      />
      <TextBlock
        label="Ambient Audio"
        value={form.ambientAudio}
        onChange={(v) => set("ambientAudio", v)}
        placeholder="Optional. Example: Gentle wind, soft crowd noise, silence."
      />
      <TextBlock
        label="Negative Prompts / Restrictions"
        value={form.extraRestrictions}
        onChange={(v) => set("extraRestrictions", v)}
        placeholder="Example: No text overlays. Keep the scene under 5 seconds."
      />
    </>
  );
}

function VideoPhotoForm({ form, set, opts }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectBlock label="Duration" value={form.duration} onChange={(v) => set("duration", v)} items={opts.duration} />
        <SelectBlock label="Aspect Ratio" value={form.aspectRatio} onChange={(v) => set("aspectRatio", v)} items={opts.aspectRatio} />
        <SelectBlock label="Motion Type" value={form.motionType} onChange={(v) => set("motionType", v)} items={opts.motionType} />
        <SelectBlock label="Camera Movement" value={form.cameraMove} onChange={(v) => set("cameraMove", v)} items={opts.cameraMove} />
        <SelectBlock label="Animation Style" value={form.animStyle} onChange={(v) => set("animStyle", v)} items={opts.animStyle} />
        <SelectBlock label="Background Motion" value={form.bgMotion} onChange={(v) => set("bgMotion", v)} items={opts.bgMotion} />
        <SelectBlock label="Mood" value={form.mood} onChange={(v) => set("mood", v)} items={opts.mood} />
        <div className="md:col-span-2">
          <SelectBlock label="Lighting" value={form.lighting} onChange={(v) => set("lighting", v)} items={opts.lighting} />
        </div>
      </div>
      <TextBlock
        label="Custom Description"
        value={form.customDescription}
        onChange={(v) => set("customDescription", v)}
        placeholder="Describe how you want the photo animated. Example: The subject slowly turns their head and smiles."
        minH="min-h-24"
      />
      <TextBlock
        label="Ambient Audio"
        value={form.ambientAudio}
        onChange={(v) => set("ambientAudio", v)}
        placeholder="Optional. Example: Soft background music, gentle breeze, silence."
      />
      <TextBlock
        label="Negative Prompts / Restrictions"
        value={form.extraRestrictions}
        onChange={(v) => set("extraRestrictions", v)}
        placeholder="Example: Do not move the background. Keep hair style unchanged."
      />
    </>
  );
}

function RefBlendForm({ form, set, opts }) {
  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">How to use this tab</p>
        <p><span className="font-medium">Image A</span> = base image — the person whose identity is preserved.</p>
        <p><span className="font-medium">Image B</span> = reference image — the source for pose, outfit, background, or makeup.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <SelectBlock label="What to apply from Image B" value={form.referenceElement} onChange={(v) => set("referenceElement", v)} items={opts.referenceElement} />
        </div>
        <div className="md:col-span-2">
          <SelectBlock label="Lighting Treatment" value={form.lighting} onChange={(v) => set("lighting", v)} items={opts.lighting} />
        </div>
      </div>
      <TextBlock
        label="Custom Description"
        value={form.customDescription}
        onChange={(v) => set("customDescription", v)}
        placeholder="Add specifics. Example: Apply the red dress from Image B but keep the original background from Image A."
        minH="min-h-24"
      />
      <TextBlock
        label="Negative Prompts / Restrictions"
        value={form.extraRestrictions}
        onChange={(v) => set("extraRestrictions", v)}
        placeholder="Example: Do not change the hairstyle. Keep the original expression from Image A."
      />
    </>
  );
}

function CombineForm({ form, set, opts }) {
  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">How to use this tab</p>
        <p><span className="font-medium">Image A</span> = Person A — the base or primary subject.</p>
        <p><span className="font-medium">Image B</span> = Person B — the source for the transfer or second person.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <SelectBlock label="What do you want to do?" value={form.combineType} onChange={(v) => set("combineType", v)} items={opts.combineType} />
        </div>
        <div className="md:col-span-2">
          <SelectBlock label="Lighting Treatment" value={form.lighting} onChange={(v) => set("lighting", v)} items={opts.lighting} />
        </div>
      </div>
      <TextBlock
        label="Custom Description"
        value={form.customDescription}
        onChange={(v) => set("customDescription", v)}
        placeholder="Add specifics. Example: Place Person A on the left. Use the red dress from Image B."
        minH="min-h-24"
      />
      <TextBlock
        label="Negative Prompts / Restrictions"
        value={form.extraRestrictions}
        onChange={(v) => set("extraRestrictions", v)}
        placeholder="Example: Do not change hairstyle. Keep the original background from Image A."
      />
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AIPromptBuilder() {
  const [activeTab, setActiveTab] = useState("imgGen");
  const [copied, setCopied]       = useState(false);

  const [igForm, setIgForm] = useState(imgGenDefault);
  const [ieForm, setIeForm] = useState(imgEditDefault);
  const [rbForm, setRbForm] = useState(refBlendDefault);
  const [cpForm, setCpForm] = useState(combineDefault);
  const [vtForm, setVtForm] = useState(vidTextDefault);
  const [vpForm, setVpForm] = useState(vidPhotoDefault);

  const makeSet = (setter) => (key, value) =>
    setter((prev) => ({ ...prev, [key]: value }));

  const igSet = makeSet(setIgForm);
  const ieSet = makeSet(setIeForm);
  const rbSet = makeSet(setRbForm);
  const cpSet = makeSet(setCpForm);
  const vtSet = makeSet(setVtForm);
  const vpSet = makeSet(setVpForm);

  const imgGenPrompt = useMemo(() => {
    const desc  = igForm.customDescription.trim();
    const extra = igForm.extraRestrictions.trim();
    return `Create a photorealistic image.

Style: ${igForm.style}
Camera: ${igForm.cameraAngle}
Aspect Ratio: ${igForm.aspectRatio}

Subject: ${igForm.subject} — ${igForm.appearance}
Clothing: ${igForm.clothing}. Realistic fabric texture and natural folds.
Pose: ${igForm.pose}. Natural posture, anatomically correct hands.
Expression: ${igForm.expression}

Background: ${igForm.background}. Realistic depth and perspective.
Lighting: ${igForm.lighting}. Consistent shadows and highlights.
Mood: ${igForm.mood}${desc ? `\n\nDescription:\n${desc}` : ""}

Technical: High detail, natural skin texture, realistic proportions, correct anatomy, no distortion, no artificial look.${extra ? `\n\nNegative Prompts / Restrictions:\n${extra}` : ""}`;
  }, [igForm]);

  const imgEditPrompt = useMemo(() => {
    const task  = ieForm.customTask.trim() || "Create a high-quality realistic image edit using the selected settings.";
    const extra = ieForm.extraRestrictions.trim();
    const bodyLine = ieForm.bodyAdjust !== "No body adjustment"
      ? `\n\nBody Adjustment:\n${ieForm.bodyAdjust}. Maintain correct skeletal proportions, natural anatomy, same pose and camera angle. Avoid any distortion.`
      : "";
    const faceLine = ieForm.faceTreatment !== "No face treatment — keep as is"
      ? `\n\nFace Treatment:\n${ieForm.faceTreatment}. Preserve facial identity and structure. Maintain natural skin texture and avoid artificial or over-smoothed appearance.`
      : "";
    return `Keep the same person exactly as in the original image.\nDo not change facial identity, facial structure, eyes, nose, lips, skin tone, hairstyle, or expression unless specifically requested.\n\nTask:\n${task}\n\nFrame / Body:\n${ieForm.frame}. Maintain correct anatomical proportions and seamless alignment with the original face and body.${bodyLine}\n\nPose:\n${ieForm.pose}. Ensure natural posture, realistic balance, anatomically correct hands, fingers, and natural foot placement.\n\nClothing:\n${ieForm.clothing}. Ensure realistic fabric texture, natural folds, correct fit, and consistent shadows.\n\nMakeup:\n${ieForm.makeupStyle}. Ensure natural makeup blending, realistic texture, and no heavy filtering.${faceLine}\n\nExpression:\n${ieForm.expression}. Keep the expression natural and believable.\n\nBackground:\n${ieForm.background}. Ensure realistic depth, perspective, and blending with the subject.\n\nLighting:\n${ieForm.lighting}. Match lighting direction, color tone, highlights, and shadows consistently.\n\nRealism Requirements:\nMake the final image photorealistic with natural anatomy, realistic proportions, accurate perspective, natural skin texture, and believable lighting.\n\nRestrictions:\nDo not distort the face, hands, fingers, arms, legs, body proportions, clothing, or background. Avoid artificial, plastic, over-smoothed, exaggerated, or AI-generated appearance.${extra ? `\n\nNegative Prompts / Restrictions:\n${extra}` : ""}`;
  }, [ieForm]);

  const refBlendPrompt = useMemo(() => {
    const desc  = rbForm.customDescription.trim();
    const extra = rbForm.extraRestrictions.trim();
    return `Use Image A as the base image and primary subject.\nPreserve the same person, facial identity, and expression from Image A.\n\nUse Image B as a reference for:\n${rbForm.referenceElement}\n\nApply the selected elements from Image B to the person in Image A,\nwhile maintaining natural anatomy, correct proportions, and realistic alignment.\n\nLighting: ${rbForm.lighting}.\n\nPrioritize identity preservation from Image A above all changes.${desc ? `\n\nAdditional Details:\n${desc}` : ""}\n\nDo not modify the face or identity from Image A.\nAvoid distortion, unrealistic blending, or artificial appearance.${extra ? `\n\nNegative Prompts / Restrictions:\n${extra}` : ""}`;
  }, [rbForm]);

  const combinePrompt = useMemo(() => {
    const desc  = cpForm.customDescription.trim();
    const extra = cpForm.extraRestrictions.trim();
    const t = cpForm.combineType;

    let base = "";
    if (t.startsWith("1.")) {
      base = `Use Image A and Image B as two separate individuals.\n\nPlace both people together in the same scene, standing naturally side by side.\n\nPreserve the identity, facial features, and proportions of both persons.\n\nEnsure consistent lighting, perspective, and scale between the two subjects.\n\nAdjust shadows and positioning so both appear naturally in the same environment.\n\nMake the result photorealistic and seamless.`;
    } else if (t.startsWith("2.")) {
      base = `Use Image A as the base image.\n\nReplace the face in Image A with the face from Image B.\n\nEnsure the facial features from Image B are accurately transferred while maintaining natural alignment with the body in Image A.\n\nMatch skin tone, lighting, and perspective for realistic blending.\n\nPreserve natural proportions and avoid distortion.`;
    } else if (t.startsWith("3.")) {
      base = `Use Image A as the base image and preserve the identity of the person.\n\nUse Image B as a reference for body pose.\n\nApply the pose from Image B to the person in Image A, including arm and leg positioning.\n\nMaintain natural anatomy, balance, and realistic proportions.\n\nEnsure the face and identity from Image A remain unchanged.`;
    } else if (t.startsWith("4.")) {
      base = `Use Image A as the base image and keep the same person.\n\nUse Image B as a reference for clothing.\n\nReplace the outfit in Image A with the clothing from Image B.\n\nEnsure realistic fabric texture, proper fit, and natural folds.\n\nMaintain the identity, pose, and proportions of the person in Image A.`;
    } else if (t.startsWith("5.")) {
      base = `Use Image A and Image B as two separate individuals.\n\nPlace both people in the same environment, interacting naturally (e.g., standing together, talking, or walking).\n\nPreserve the identity and facial features of both individuals.\n\nEnsure correct scale, perspective, and lighting consistency.\n\nAdd natural shadows and positioning so both subjects appear grounded and realistic.\n\nAvoid any distortion or artificial appearance.`;
    } else if (t.startsWith("6.")) {
      base = `Use Image A as the subject.\n\nUse Image B as the background/environment reference only — do not include the person from Image B.\n\nPlace the person from Image A into the setting from Image B.\n\nEnsure consistent lighting, perspective, and scale between the subject and the new environment.\n\nAdjust shadows and reflections so the person appears naturally integrated into the scene.`;
    } else {
      base = `Create a blended face combining features from Image A and Image B.\n\nMaintain a natural and realistic appearance with balanced proportions.\n\nEnsure smooth integration of facial features without distortion.\n\nKeep lighting and skin tone consistent.\n\nNote: Hybrid blending is advanced and results may be less predictable.`;
    }

    return `${base}\n\nLighting: ${cpForm.lighting}.${desc ? `\n\nAdditional Details:\n${desc}` : ""}${extra ? `\n\nNegative Prompts / Restrictions:\n${extra}` : ""}`;
  }, [cpForm]);

  const vidTextPrompt = useMemo(() => {
    const desc  = vtForm.customDescription.trim();
    const extra = vtForm.extraRestrictions.trim();
    const audio = vtForm.ambientAudio.trim();
    return `Generate a ${vtForm.style} video — ${vtForm.duration}.
Aspect Ratio: ${vtForm.aspectRatio}

Scene: ${vtForm.background} with ${vtForm.mood.toLowerCase()} atmosphere.
Subject: ${vtForm.subject} — ${vtForm.action}.
Camera: ${vtForm.cameraMove} throughout the shot.
Lighting: ${vtForm.lighting}${audio ? `\nAmbient Audio: ${audio}` : ""}${desc ? `\n\nDescription:\n${desc}` : ""}

Technical: Smooth fluid motion, cinematic quality, consistent lighting, natural movement. No abrupt transitions. Maintain ${vtForm.mood.toLowerCase()} mood throughout the entire clip.${extra ? `\n\nNegative Prompts / Restrictions:\n${extra}` : ""}`;
  }, [vtForm]);

  const vidPhotoPrompt = useMemo(() => {
    const desc  = vpForm.customDescription.trim();
    const extra = vpForm.extraRestrictions.trim();
    const audio = vpForm.ambientAudio.trim();
    return `Animate this still photo into a ${vpForm.duration} video clip.\nAspect Ratio: ${vpForm.aspectRatio}\nKeep the same person exactly as in the original image. Do not change facial identity, skin tone, or appearance.\n\nMotion: ${vpForm.motionType}. Keep movement natural and believable.\nCamera: ${vpForm.cameraMove}\nAnimation Style: ${vpForm.animStyle}\nBackground: ${vpForm.bgMotion}\nLighting: ${vpForm.lighting}. Consistent with the original photo.\nMood: ${vpForm.mood}${audio ? `\nAmbient Audio: ${audio}` : ""}${desc ? `\n\nDescription:\n${desc}` : ""}\n\nRestrictions: Preserve facial identity throughout the entire clip. No morphing or distortion of face, hands, or body. Smooth and realistic motion only. Avoid any flickering or unnatural deformation.${extra ? `\n\nNegative Prompts / Restrictions:\n${extra}` : ""}`;
  }, [vpForm]);

  const activePrompt =
    activeTab === "imgGen"   ? imgGenPrompt   :
    activeTab === "imgEdit"  ? imgEditPrompt  :
    activeTab === "refBlend" ? refBlendPrompt :
    activeTab === "combine"  ? combinePrompt  :
    activeTab === "vidText"  ? vidTextPrompt  :
                               vidPhotoPrompt;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(activePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleReset = () => {
    if      (activeTab === "imgGen")   setIgForm(imgGenDefault);
    else if (activeTab === "imgEdit")  setIeForm(imgEditDefault);
    else if (activeTab === "refBlend") setRbForm(refBlendDefault);
    else if (activeTab === "combine")  setCpForm(combineDefault);
    else if (activeTab === "vidText")  setVtForm(vidTextDefault);
    else                               setVpForm(vidPhotoDefault);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI Prompt Builder
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Build AI prompts fast
          </h1>
          <p className="max-w-3xl text-slate-600">
            Generate structured prompts for image creation, image editing, and video generation — all in one place.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
          {TABS.map(({ id, label, sub, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex flex-col items-start leading-tight">
                <span>{label}</span>
                <span className={`text-xs font-normal ${activeTab === id ? "text-slate-300" : "text-slate-400"}`}>
                  {sub}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="space-y-5 p-5">
              {activeTab === "imgGen"   && <ImageGenForm   form={igForm} set={igSet} opts={imgGenOptions}    />}
              {activeTab === "imgEdit"  && <ImageEditForm  form={ieForm} set={ieSet} opts={imgEditOptions}   />}
              {activeTab === "refBlend" && <RefBlendForm   form={rbForm} set={rbSet} opts={refBlendOptions}  />}
              {activeTab === "combine"  && <CombineForm    form={cpForm} set={cpSet} opts={combineOptions}   />}
              {activeTab === "vidText"  && <VideoTextForm  form={vtForm} set={vtSet} opts={vidTextOptions}   />}
              {activeTab === "vidPhoto" && <VideoPhotoForm form={vpForm} set={vpSet} opts={vidPhotoOptions}  />}

              <Button variant="outline" onClick={handleReset} className="rounded-xl">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Generated Prompt</h2>
                <Button onClick={copyPrompt} className="rounded-xl">
                  <Copy className="mr-2 h-4 w-4" /> {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="min-h-[520px] flex-1 whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100 shadow-inner">
                {activePrompt}
              </pre>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
