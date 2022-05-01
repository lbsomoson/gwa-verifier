import React from "react";
import styles from "./BasicButton.module.css";

class BasicButton extends React.Component {

    constructor(props) {
        super(props);

        this.getColorVariant = this.getColorVariant.bind(this);
    }

    getColorVariant(variant, color) {
		switch (color) {
			case "brand-default":
				return variant === "outline"
					? styles.outlineBrandDefault
					: styles.filledBrandDefault;
			case "brand-lighter":
				return variant === "outline"
					? styles.outlineBrandLighter
					: styles.filledBrandLighter;
			case "brand-darker":
				return variant === "outline"
					? styles.outlineBrandDarker
					: styles.filledBrandDarker;
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
            >
                {this.props.label}
            </button>
        );
    }

}

export default BasicButton;