import { useFocusEffect, useRouter } from "expo-router";
import { BookOpen, Plus, Search } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StoryActions from "../../components/StoryActions";

import {
    getStories,
    getStoryCommentCount,
    type Story,
} from "../../lib/appwrite";

const BG = "#100D20";
const CARD = "#1D1833";
const PURPLE = "#A78BFA";
const MUTED = "#AAA3C2";
const BORDER = "#332A4B";

export default function StoriesScreen() {
  const router = useRouter();

  const [stories, setStories] = useState<Story[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadStories = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getStories();
      setStories(data);

      const entries = await Promise.all(
        data.map(async (story) => {
          try {
            return [story.$id, await getStoryCommentCount(story.$id)] as const;
          } catch {
            return [story.$id, 0] as const;
          }
        }),
      );

      setCounts(Object.fromEntries(entries));
    } catch (error) {
      console.error("Stories loading error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadStories();
    }, [loadStories]),
  );

  const categories = [
    "All",
    ...new Set(stories.map((story) => story.category)),
  ];

  const filteredStories = stories.filter((story) => {
    const matchesCategory = category === "All" || story.category === category;

    const matchesSearch =
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      story.writerName.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function openCreateScreen() {
    router.push("/create");
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: BG }}>
      {/* Header */}
      <View className="px-5 pb-3 pt-4">
        <Text className="text-2xl font-black text-white">All Stories 📚</Text>

        <Text className="mt-1 text-sm" style={{ color: MUTED }}>
          Discover your next adventure.
        </Text>

        {/* Create Story Button */}
        <Pressable
          onPress={openCreateScreen}
          className="mt-5 min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl"
          style={{ backgroundColor: PURPLE }}
        >
          <Plus size={21} color={BG} />

          <Text className="text-[15px] font-extrabold" style={{ color: BG }}>
            Create a story
          </Text>
        </Pressable>

        {/* Search */}
        <View
          className="mt-4 flex-row items-center rounded-2xl border px-4"
          style={{
            backgroundColor: CARD,
            borderColor: BORDER,
          }}
        >
          <Search size={18} color={MUTED} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search stories..."
            placeholderTextColor={MUTED}
            className="flex-1 p-4 text-white"
          />
        </View>
      </View>

      {/* Categories */}
      <View className="mb-3">
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 9,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setCategory(item)}
              className="rounded-full border px-4 py-2"
              style={{
                backgroundColor: category === item ? "#30234F" : CARD,
                borderColor: category === item ? PURPLE : BORDER,
              }}
            >
              <Text
                className="text-xs font-bold"
                style={{
                  color: category === item ? "#C4B5FD" : MUTED,
                }}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Stories */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={PURPLE} />

          <Text className="mt-3" style={{ color: MUTED }}>
            Loading stories...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStories}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{
            padding: 18,
            paddingBottom: 35,
            flexGrow: 1,
          }}
          refreshing={loading}
          onRefresh={() => void loadStories()}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-5xl">📖</Text>

              <Text className="mt-4 font-bold text-white">
                No stories found
              </Text>

              <Text className="mt-2 text-sm" style={{ color: MUTED }}>
                Try another search or category.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              className="mb-3 flex-row rounded-2xl border p-3"
              style={{
                backgroundColor: CARD,
                borderColor: BORDER,
              }}
            >
              {/* Story Cover */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { id: item.$id },
                  })
                }
                className="flex-row flex-1"
              >
                {item.imageUrl?.trim() ? (
                  <Image
                    source={{ uri: item.imageUrl.trim() }}
                    className="h-[90px] w-[90px] rounded-xl"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="h-[90px] w-[90px] items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: item.color || "#30234F",
                    }}
                  >
                    <Text className="text-4xl">{item.emoji || "📖"}</Text>
                  </View>
                )}

                {/* Story Information */}
                <View className="ml-3 flex-1 justify-center">
                  <Text className="text-xs font-bold text-[#C4B5FD]">
                    {item.category}
                  </Text>

                  <Text
                    numberOfLines={2}
                    className="mt-1 text-base font-extrabold text-white"
                  >
                    {item.title}
                  </Text>

                  <Text className="mt-1 text-xs" style={{ color: MUTED }}>
                    By {item.writerName}
                  </Text>

                  <View className="mt-2 flex-row items-center">
                    <BookOpen size={13} color={PURPLE} />

                    <Text className="ml-2 text-xs text-[#C4B5FD]">
                      {counts[item.$id] ?? 0} comments
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Update / Delete */}
              <View className="ml-2">
                <StoryActions story={item} onChanged={loadStories} />
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
