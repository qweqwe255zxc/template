import { Section } from "@/components/ui/Section";
import { AboutLayout } from "../parts/AboutLayout";
import type { AboutSection } from "@/types/site";

/**
 * Раскладка текст+фото 5/12+7/12. Сторона фото — photoPosition
 * ("right" по умолчанию, "left" — зеркально через md:order-*).
 */
export function Photo(props: AboutSection) {
  const { id, surface = "paper", photo, photoPosition = "right" } = props;

  if (process.env.NODE_ENV !== "production" && !photo) {
    console.warn(`[About] Секция "${id}": variant="photo" требует photo.`);
  }
  if (!photo) return null;

  return (
    <Section id={id} surface={surface}>
      <AboutLayout {...props} photo={photo} photoFirst={photoPosition === "left"} />
    </Section>
  );
}

export default Photo;
