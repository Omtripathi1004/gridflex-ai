import pytest
from app.routers.resilience import get_resilience_breakdown

def test_resilience_four_pillar_weights_sum():
    """Verify that all 4 resilience pillars sum to exactly 1.0 (100%)."""
    data = get_resilience_breakdown()
    components = data["components"]
    assert len(components) == 4, f"Expected 4 pillars, got {len(components)}"
    
    total_weight = sum(c["weight"] for c in components)
    assert round(total_weight, 4) == 1.0, f"Weights must sum to 1.0, got {total_weight}"

def test_resilience_composite_arithmetic():
    """Verify that composite_score equals the exact dot product of weights and scores."""
    data = get_resilience_breakdown()
    components = data["components"]
    
    expected_composite = round(sum(c["weight"] * c["score"] for c in components), 1)
    actual_composite = data["composite_score"]
    
    assert actual_composite == expected_composite, (
        f"Arithmetic mismatch: expected {expected_composite}, got {actual_composite}"
    )

def test_resilience_component_bounds():
    """Verify each pillar score is bounded between 0 and 100."""
    data = get_resilience_breakdown()
    for c in data["components"]:
        assert 0.0 <= c["score"] <= 100.0, f"Score out of bounds for {c['key']}: {c['score']}"

def test_resilience_status_grade():
    """Verify status grade corresponds correctly to composite score thresholds."""
    data = get_resilience_breakdown()
    score = data["composite_score"]
    grade = data["status_grade"]
    
    if score >= 80:
        assert grade == "High Resilience"
    elif score >= 65:
        assert grade == "Adequate"
    else:
        assert grade == "At Risk"
