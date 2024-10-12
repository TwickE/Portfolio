import './ProjectCard.css'
import PropTypes from 'prop-types';
import OutlineButton from '../OutlineButton/OutlineButton';
import iconsFile from '../../../assets/icons.svg'
import SmallSkillBadge from '../SmallSkillBadge/SmallSkillBadge';
import useLoadBadgeImages from '../../../hooks/useLoadBadgeImages';
import { useState, forwardRef } from 'react';

const ProjectCard = forwardRef(({ cardProps }, ref) => {
    const badgeImages = useLoadBadgeImages(cardProps.cardSmallBadges);
    const [selectedImage, setSelectedImage] = useState({
        image: cardProps.cardImages[0].image,
        imageDescription: cardProps.cardImages[0].imageDescription
    });

    const handleImageClick = (image, imageDescription) => {
        setSelectedImage({ image, imageDescription });
    };

    return (
        <div className='card-container' ref={ref}>
            <object type="image/svg+xml" data={iconsFile} style={{display: 'none'}}></object>
            <h3>{cardProps.cardTitle}</h3>
            <span>{cardProps.date}</span>
            <p>{cardProps.cardDescription}</p>
            <div className='card-links-container'>
                {cardProps.cardLinks.map((link, index) => (
                    <OutlineButton
                        key={index}
                        buttonProps={{
                            buttonSmall: true,
                            startImage: true,
                            startImageSrc: link.linkImage,
                            text: link.linkTitle,
                            endImage: true,
                            endImageSrc: 'arrow-icon',
                            endImageRotate: true,
                            clickFunction: () => window.open(link.linkUrl)
                        }}
                    />
                ))}
            </div>
            <div className='card-small-badges-container'>
                {cardProps.cardSmallBadges.map((badge, index) => (
                    <SmallSkillBadge
                    key={index}
                    text = {badge.badgeTitle}
                    icon={badgeImages[badge.badgeTitle]}
                />
                ))}
            </div>
            <div className='card-images-container'>
                <div className='card-images-selector'>
                    {cardProps.cardImages.map((image, index) => (
                        <img 
                            key={index}
                            src={image.image} 
                            alt={image.imageDescription}
                            className={selectedImage.image === image.image ? 'selected-image-border' : ''}
                            onClick={() => handleImageClick(image.image)}
                        />
                    ))}
                </div>
                <img className='selected-image' src={selectedImage.image} alt={selectedImage.imageDescription} />
            </div>
        </div>
    )
})

ProjectCard.displayName = 'ProjectCard';

ProjectCard.propTypes = {
    cardProps: PropTypes.shape({
        cardTitle: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        cardDescription: PropTypes.string.isRequired,
        cardLinks: PropTypes.arrayOf(PropTypes.shape({
            linkTitle: PropTypes.string.isRequired,
            linkImage: PropTypes.string.isRequired,
            linkUrl: PropTypes.string.isRequired
        })).isRequired,
        cardSmallBadges: PropTypes.arrayOf(PropTypes.shape({
            badgeTitle: PropTypes.string.isRequired,
            badgeImage: PropTypes.string.isRequired
        })).isRequired,
        cardImages: PropTypes.arrayOf(PropTypes.shape({
            image: PropTypes.string.isRequired,
            imageDescription: PropTypes.string.isRequired
        })).isRequired
    }).isRequired
};

export default ProjectCard