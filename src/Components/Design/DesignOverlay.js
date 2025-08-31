import React, { useRef } from "react";

const DesignOverlay = ({
                           imageUrl,
                           design,
                           position = { x: 0, y: 0 },
                           scale = 1,
                           onMouseDown,
                           onMouseMove,
                           onMouseUp,
                           editable = false,
                           containerRef,
                           designRef,
                           productImageRef,
                       }) => {
    return (
        <div
            className="product-image-section"
            ref={containerRef}
            onMouseMove={editable ? onMouseMove : undefined}
            onMouseUp={editable ? onMouseUp : undefined}
            onMouseLeave={editable ? onMouseUp : undefined}
            style={{ marginRight: "50px" }}
        >
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Produit"
                    className="product-base"
                    ref={productImageRef}
                />
            )}
            {design && (
                <img
                    src={design}
                    alt="Design"
                    ref={designRef}
                    className="design-overlay"
                    style={{
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        transform: `scale(${scale})`,
                        pointerEvents: editable ? "auto" : "none",
                    }}
                    onMouseDown={editable ? onMouseDown : undefined}
                />
            )}
        </div>
    );
};

export default DesignOverlay;
