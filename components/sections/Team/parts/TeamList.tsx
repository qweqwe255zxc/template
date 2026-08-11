import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/cn";
import { MemberContent } from "./MemberContent";
import type { TeamSection } from "@/types/site";

/**
 * Список людей на линейках, 3 колонки — вариант columns. rows строит
 * свою раскладку (фото слева на всю высоту строки, содержимое справа),
 * этот компонент ей не подходит и больше не используется.
 */
export function TeamList({
  number,
  eyebrow,
  title,
  lead,
  items,
  alignExperienceBottom = false,
}: TeamSection) {
  return (
    <Container>
      <SectionHeader
        number={number}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
      />

      <ul className="mt-14 grid gap-x-gutter md:mt-20 md:grid-cols-3 md:gap-y-14 xl:grid-cols-4">
        {items.map((member, index) => (
          <li
            key={member.name}
            data-reveal
            style={revealDelay(index)}
            className={cn(
              // Линейки над карточкой больше нет. Она висела над фото в
              // пустоте и читалась как обрывок чужой таблицы: делить ей
              // было нечего, соседний столбец начинался ровно на той же
              // высоте. Столбцы и так разделены колонками сетки.
              index > 0 && "mt-10 md:mt-0",
              // flex-col + h-full: grid по умолчанию растягивает <li> до
              // высоты самой высокой ячейки ряда (align-items: stretch), но
              // margin-top: auto ВНУТРИ ячейки работает только в её
              // собственном flex-контексте — без flex-col тут его не на что
              // опереть, и стаж не прижимался к низу.
              alignExperienceBottom && "flex h-full flex-col",
            )}
          >
            <MemberContent member={member} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default TeamList;
