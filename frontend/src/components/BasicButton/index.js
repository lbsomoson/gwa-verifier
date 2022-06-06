import React from "react";
import styles from "./BasicButton.module.css";

class BasicButton extends React.Component {

    constructor(props) {
        super(props);

        this.getColorVariant = this.getColorVariant.bind(this);
    }

    getColorVariant(variant, color) {
		switch (color) {
			case "brand-primary":
				return variant === "outline"
					? styles.outlineBrandPrimary
					: styles.filledBrandPrimary;
			case "brand-secondary":
				return variant === "outline"
					? styles.outlineBrandSecondary
					: styles.filledBrandSecondary;
			case "brand-tertiary":
				return variant === "outline"
					? styles.outlineBrandTertiary
					: styles.filledBrandTertiary;
			case "active":
				return styles.filledBrandSecondaryActive;
			case "red":
				return variant === "outline" ? styles.outlineRed : styles.filledRed;
			case "green":
				return variant === "outline" ? styles.outlineGreen : styles.filledGreen;
			case "blue":
				return variant === "outline" ? styles.outlineBlue : styles.filledBlue;
			case "black":
				return variant === "outline" ? styles.outlineBlack : styles.filledBlack;
			case "white":
				return variant === "outline" ? styles.outlineWhite : styles.filledWhite;
			default:
				return "";
		}
	}

    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={`
                    button-text
                    ${styles.baseStyles} 
                    ${this.props.size === "small" ? styles.smallButton : styles.defaultButton}
                    ${this.getColorVariant(this.props.variant, this.props.color)}
                    ${this.props.disabled ? styles.disabled : ""}
                    ${this.props.block ? styles.block : ""}
                `}
                disabled={this.props.disabled}
								value={this.props.value}
								id={this.props.id}
								hidden={this.props.hidden}
            >
							<div className={styles.children}>
								{this.props.icon}
								{this.props.label}
							</div>
							{/* {this.props.icons !== null ? <i className={styles.icons}>{this.props.icon}</i> : ""} */}
							
            </button>
        );
    }

}

export default BasicButton;