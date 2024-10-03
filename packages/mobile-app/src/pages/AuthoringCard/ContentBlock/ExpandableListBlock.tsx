import { ReactNode, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ExpandableListBlockType } from '@learn-to-win/common/features/Cards/cardTypes';
import { RichTextViewer } from './RichTextViewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCardCompletionForExpandableList } from '@learn-to-win/common/hooks/CardCompletionCheck';

export function ExpandableListBlock({
  contentBlock,
}: {
  contentBlock: ExpandableListBlockType;
}) {
  const sections = contentBlock.sections;
  const [openSection, setOpenSection] = useState(sections?.[0].id);
  const { setExpandableListSectionAsViewed } =
    useCardCompletionForExpandableList(contentBlock.id);
  const handleOpenSection = (sectionIdx: number) => {
    setOpenSection(sections[sectionIdx].id);
    setExpandableListSectionAsViewed(sectionIdx);
  };
  return (
    <View>
      {sections.map((section, i) => (
        <View key={section.id}>
          <TouchableOpacity
            style={[styles.header, i === 0 && styles.firstHeader]}
            onPress={() => handleOpenSection(i)}>
            <View style={{ flex: 1 }}>
              <RichTextViewer json={section.title} renderLastMargin={false} />
            </View>
            <Icon
              name={openSection === section.id ? 'chevron-up' : 'chevron-down'}
              size={30}
            />
          </TouchableOpacity>
          <ExpandableSection isOpen={section.id === openSection}>
            <RichTextViewer json={section.content} />
          </ExpandableSection>
        </View>
      ))}
    </View>
  );
}

function ExpandableSection({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) {
  // TODO: Add animations :(
  return <View>{isOpen ? children : null}</View>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  firstHeader: {
    borderTopWidth: 0,
  },
});
