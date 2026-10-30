import { useRouter } from "expo-router";
import {
    ArrowLeft,
    BookOpen,
    Check,
    ImagePlus,
    Link2,
    PenLine,
    Sparkles,
} from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStory } from "../lib/appwrite";

const BG = "#100D20";
const CARD = "#1D1833";
const PURPLE = "#A78BFA";
const MUTED = "#AAA3C2";
const BORDER = "#332A4B";

const categories = [
  "Animals",
  "Fairy Tales",
  "Adventure",
  "Fantasy",
  "Science Fiction",
];

const emojis = ["📖", "🐰", "🧚", "🚀", "🐉", "🌈"];

export default function CreateScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [writerName, setWriterName] = useState("");
  const [category, setCategory] = useState("Animals");
  const [emoji, setEmoji] = useState("📖");
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    if (
      !title.trim() ||
      !writerName.trim() ||
      !category.trim() ||
      !emoji.trim() ||
      !story.trim()
    ) {
      Alert.alert(
        "Missing information",
        "Please complete the required story details.",
      );
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      await createStory({
        title: title.trim(),
        writerName: writerName.trim(),
        category: category.trim(),
        emoji: emoji.trim(),
        color: PURPLE,
        story: story.trim(),
        imageUrl: imageUrl.trim(),
      });

      Alert.alert(
        "Story published! ✨",
        "Your story has been saved to TinyTales.",
        [
          {
            text: "View stories",
            onPress: () => router.replace("/(tabs)/stories"),
          },
        ],
      );

      setTitle("");
      setWriterName("");
      setCategory("Animals");
      setEmoji("📖");
      setStory("");
      setImageUrl("");
      setImageError(false);
    } catch (error) {
      console.error("Failed to publish story:", error);

      Alert.alert(
        "Couldn't publish",
        "Check your connection, Appwrite permissions, and story table attributes.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: BG }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        style={{ backgroundColor: BG }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-12 pt-3"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          {/* Top navigation */}
          <View className="mb-7 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: CARD,
                borderColor: BORDER,
              }}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </Pressable>

            <View className="flex-row items-center gap-2">
              <View
                className="h-8 w-8 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#30234F" }}
              >
                <BookOpen size={16} color={PURPLE} />
              </View>

              <Text className="text-base font-extrabold text-white">
                TinyTales
              </Text>
            </View>

            <View className="w-11" />
          </View>

          {/* Hero */}
          <View className="mb-7">
            <View className="mb-3 flex-row items-center gap-2">
              <Sparkles size={15} color={PURPLE} />

              <Text
                className="text-[10px] font-extrabold tracking-[2px]"
                style={{ color: PURPLE }}
              >
                YOUR CREATIVE SPACE
              </Text>
            </View>

            <Text className="text-[30px] font-black leading-[38px] text-white">
              Create something{"\n"}
              <Text style={{ color: PURPLE }}>wonderful.</Text>
            </Text>

            <Text className="mt-3 text-sm leading-6" style={{ color: MUTED }}>
              Every little idea can become a big adventure. Start writing yours.
            </Text>
          </View>

          {/* Writing tip */}
          <View
            className="mb-7 flex-row items-center gap-3 rounded-2xl border p-4"
            style={{
              backgroundColor: "#241B3C",
              borderColor: "#493567",
            }}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#382957" }}
            >
              <Sparkles size={19} color={PURPLE} />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-bold text-white">
                A little inspiration
              </Text>

              <Text className="mt-1 text-xs leading-5" style={{ color: MUTED }}>
                Don't worry about perfection. Just let your imagination flow.
              </Text>
            </View>
          </View>

          {/* Story details */}
          <SectionTitle
            number="01"
            title="Story details"
            subtitle="Give your story its identity."
          />

          <FieldLabel label="Story title" required />

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. The little moon rabbit"
            placeholderTextColor="#77718D"
            className="rounded-2xl border px-4 py-[17px] text-sm text-white"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            maxLength={120}
          />

          <Text
            className="mt-2 text-right text-[10px]"
            style={{ color: MUTED }}
          >
            {title.length}/120
          </Text>

          <FieldLabel label="Writer name" required />

          <TextInput
            value={writerName}
            onChangeText={setWriterName}
            placeholder="What should readers call you?"
            placeholderTextColor="#77718D"
            className="rounded-2xl border px-4 py-[17px] text-sm text-white"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            maxLength={60}
          />

          {/* Category: Select or write */}
          <FieldLabel label="Story category" required />

          <View
            className="rounded-2xl border p-3"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-white">
                Choose or create a category
              </Text>

              <Text className="text-[10px]" style={{ color: MUTED }}>
                Select / Write
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {categories.map((item) => {
                const selected = category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setCategory(item)}
                    activeOpacity={0.8}
                    className="flex-row items-center gap-2 rounded-xl border px-3 py-3"
                    style={{
                      backgroundColor: selected ? "#382957" : "#171326",
                      borderColor: selected ? PURPLE : BORDER,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: selected ? "#FFFFFF" : MUTED }}
                    >
                      {item}
                    </Text>

                    {selected && <Check size={13} color={PURPLE} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="my-3 h-px" style={{ backgroundColor: BORDER }} />

            <Text className="mb-2 text-xs font-semibold text-white">
              Or write your own
            </Text>

            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Mystery, Comedy, History..."
              placeholderTextColor="#77718D"
              autoCapitalize="words"
              className="rounded-xl border px-4 py-4 text-sm text-white"
              style={{
                backgroundColor: "#171326",
                borderColor: BORDER,
              }}
              maxLength={40}
            />
          </View>

          {/* Emoji: Select or write */}
          <FieldLabel label="Story emoji" required />

          <View
            className="rounded-2xl border p-3"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-white">
                Choose an emoji
              </Text>

              <Text className="text-[10px]" style={{ color: MUTED }}>
                Select / Write
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {emojis.map((item) => {
                const selected = emoji === item;

                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setEmoji(item)}
                    activeOpacity={0.8}
                    className="h-12 w-12 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: selected ? "#382957" : "#171326",
                      borderColor: selected ? PURPLE : BORDER,
                    }}
                  >
                    <Text className="text-2xl">{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="my-3 h-px" style={{ backgroundColor: BORDER }} />

            <Text className="mb-2 text-xs font-semibold text-white">
              Or enter your own emoji
            </Text>

            <View className="flex-row items-center gap-3">
              <TextInput
                value={emoji}
                onChangeText={setEmoji}
                placeholder="Type or paste an emoji"
                placeholderTextColor="#77718D"
                className="h-[54px] flex-1 rounded-xl border px-4 text-sm text-white"
                style={{
                  backgroundColor: "#171326",
                  borderColor: BORDER,
                }}
                maxLength={12}
              />

              <View
                className="h-[54px] w-[54px] items-center justify-center rounded-xl border"
                style={{
                  backgroundColor: "#382957",
                  borderColor: PURPLE,
                }}
              >
                <Text className="text-3xl">{emoji || "📖"}</Text>
              </View>
            </View>
          </View>

          {/* Story cover */}
          <View className="mt-9">
            <SectionTitle
              number="02"
              title="Story cover"
              subtitle="Give readers a glimpse of your world."
            />
          </View>

          <View
            className="overflow-hidden rounded-2xl border"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <View className="flex-row items-center px-4">
              <Link2 size={18} color={MUTED} />

              <TextInput
                value={imageUrl}
                onChangeText={(value) => {
                  setImageUrl(value);
                  setImageError(false);
                }}
                placeholder="Paste your image URL"
                placeholderTextColor="#77718D"
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 py-[17px] pl-3 text-sm text-white"
              />
            </View>

            {imageUrl.trim().length > 0 ? (
              !imageError ? (
                <Image
                  key={imageUrl.trim()}
                  source={{ uri: imageUrl.trim() }}
                  resizeMode="cover"
                  className="h-52 w-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <View
                  className="h-36 items-center justify-center border-t"
                  style={{ borderColor: BORDER }}
                >
                  <ImagePlus size={26} color={MUTED} />

                  <Text className="mt-2 text-sm font-semibold text-white">
                    Image unavailable
                  </Text>

                  <Text className="mt-1 text-xs" style={{ color: MUTED }}>
                    Please check your image URL.
                  </Text>
                </View>
              )
            ) : (
              <View
                className="h-36 items-center justify-center border-t"
                style={{
                  borderColor: BORDER,
                  backgroundColor: "#171326",
                }}
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "#30234F" }}
                >
                  <ImagePlus size={23} color={PURPLE} />
                </View>

                <Text className="mt-3 text-xs" style={{ color: MUTED }}>
                  Your cover preview will appear here
                </Text>
              </View>
            )}
          </View>

          <Text className="mt-2 text-[11px] leading-5" style={{ color: MUTED }}>
            Optional · Use a direct image link.
          </Text>

          {/* Story editor */}
          <View className="mt-9">
            <SectionTitle
              number="03"
              title="Your story"
              subtitle="This is where the magic happens."
            />
          </View>

          <View
            className="overflow-hidden rounded-2xl border"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <View
              className="flex-row items-center justify-between border-b px-4 py-3"
              style={{ borderColor: BORDER }}
            >
              <View className="flex-row items-center gap-2">
                <PenLine size={15} color={PURPLE} />

                <Text className="text-xs font-bold text-white">
                  Story editor
                </Text>
              </View>

              <Text className="text-[10px]" style={{ color: MUTED }}>
                {story.length.toLocaleString()}/10,000
              </Text>
            </View>

            <TextInput
              value={story}
              onChangeText={setStory}
              placeholder="Once upon a time, in a magical land..."
              placeholderTextColor="#77718D"
              multiline
              textAlignVertical="top"
              maxLength={10000}
              className="min-h-[250px] px-4 py-4 text-sm leading-7 text-white"
            />
          </View>

          {/* Publish */}
          <TouchableOpacity
            onPress={handlePublish}
            disabled={loading}
            activeOpacity={0.85}
            className="mt-7 min-h-[56px] flex-row items-center justify-center gap-3 rounded-2xl"
            style={{
              backgroundColor: PURPLE,
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color={BG} />
            ) : (
              <>
                <Sparkles size={19} color={BG} />

                <Text
                  className="text-[15px] font-extrabold"
                  style={{ color: BG }}
                >
                  Publish your story
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text
            className="mb-5 mt-5 text-center text-[11px]"
            style={{ color: "#77718D" }}
          >
            Made with imagination, shared with TinyTales.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-5">
      <View className="flex-row items-center gap-2">
        <Text
          className="text-[10px] font-extrabold tracking-widest"
          style={{ color: PURPLE }}
        >
          {number}
        </Text>

        <View className="h-px flex-1" style={{ backgroundColor: BORDER }} />
      </View>

      <Text className="mt-3 text-xl font-extrabold text-white">{title}</Text>

      <Text className="mt-1 text-xs" style={{ color: MUTED }}>
        {subtitle}
      </Text>
    </View>
  );
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <View className="mb-2 mt-5 flex-row items-center">
      <Text className="text-[13px] font-bold text-white">{label}</Text>

      {required && (
        <Text className="ml-1 text-xs" style={{ color: PURPLE }}>
          *
        </Text>
      )}
    </View>
  );
}
