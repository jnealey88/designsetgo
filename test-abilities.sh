#!/bin/bash

###############################################################################
# DesignSetGo Abilities API Test Suite
#
# Quick automated testing of all WordPress Abilities API integration
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WP_URL="http://localhost:8888"
WP_USER="admin"
WP_PASS=""  # Will prompt if not set

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_test() {
    echo -e "\n${YELLOW}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

###############################################################################
# Setup
###############################################################################

print_header "DesignSetGo Abilities API Test Suite"

# Check if wp-env is running
print_test "Checking WordPress environment..."
if ! curl -s "$WP_URL" > /dev/null 2>&1; then
    print_error "WordPress not running at $WP_URL"
    echo "Run: npx wp-env start"
    exit 1
fi
print_success "WordPress is running"

# Prompt for Application Password if not set
if [ -z "$WP_PASS" ]; then
    echo ""
    echo "Please create an Application Password:"
    echo "1. Go to $WP_URL/wp-admin/profile.php"
    echo "2. Scroll to 'Application Passwords'"
    echo "3. Create new password with name: 'Abilities Testing'"
    echo ""
    read -s -p "Enter Application Password: " WP_PASS
    echo ""
fi

# Check authentication
print_test "Verifying authentication..."
AUTH_TEST=$(curl -s -u "$WP_USER:$WP_PASS" "$WP_URL/wp-json/wp/v2/users/me" | jq -r '.id // empty')
if [ -z "$AUTH_TEST" ]; then
    print_error "Authentication failed - check username/password"
    exit 1
fi
print_success "Authenticated as user ID: $AUTH_TEST"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    print_info "jq not installed - install for better output: brew install jq"
    USE_JQ=false
else
    USE_JQ=true
fi

###############################################################################
# Test 1: Check Abilities API is Loaded
###############################################################################

print_header "Test 1: Abilities API Installation"

print_test "Checking if Abilities API endpoints exist..."
ABILITIES_ENDPOINT=$(curl -s "$WP_URL/wp-json/wp-abilities/v1/abilities" | jq -r 'type // empty')
if [ "$ABILITIES_ENDPOINT" = "array" ]; then
    print_success "Abilities API is installed and working"
else
    print_error "Abilities API endpoint not found"
    print_info "Check: composer show wordpress/abilities-api"
    exit 1
fi

###############################################################################
# Test 2: Check DesignSetGo Abilities are Registered
###############################################################################

print_header "Test 2: DesignSetGo Abilities Registration"

print_test "Fetching registered abilities..."
ALL_ABILITIES=$(curl -s -u "$WP_USER:$WP_PASS" "$WP_URL/wp-json/wp-abilities/v1/abilities")

if [ "$USE_JQ" = true ]; then
    DSG_ABILITIES=$(echo "$ALL_ABILITIES" | jq '[.[] | select(.name | startswith("designsetgo/"))]')
    ABILITY_COUNT=$(echo "$DSG_ABILITIES" | jq 'length')

    if [ "$ABILITY_COUNT" -eq 5 ]; then
        print_success "Found all 5 DesignSetGo abilities"
        echo "$DSG_ABILITIES" | jq -r '.[] | "  - \(.name): \(.label)"'
    else
        print_error "Expected 5 abilities, found $ABILITY_COUNT"
        echo "$DSG_ABILITIES" | jq -r '.[] | "  - \(.name)"'
    fi
else
    print_info "Install jq for detailed ability list"
    if echo "$ALL_ABILITIES" | grep -q "designsetgo"; then
        print_success "DesignSetGo abilities found"
    else
        print_error "No DesignSetGo abilities registered"
    fi
fi

###############################################################################
# Test 3: Create Test Post
###############################################################################

print_header "Test 3: Create Test Post"

print_test "Creating test post for abilities..."
TEST_POST_ID=$(npx wp-env run cli wp post create \
    --post_title="Abilities API Test $(date +%s)" \
    --post_status=publish \
    --porcelain 2>/dev/null || echo "")

if [ -n "$TEST_POST_ID" ]; then
    print_success "Created test post ID: $TEST_POST_ID"
else
    print_error "Failed to create test post"
    exit 1
fi

###############################################################################
# Test 4: List Blocks Ability
###############################################################################

print_header "Test 4: designsetgo/list-blocks"

print_test "Executing list-blocks ability..."
LIST_RESULT=$(curl -s -X POST \
    -u "$WP_USER:$WP_PASS" \
    -H "Content-Type: application/json" \
    "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
    -d '{"category": "all"}')

if [ "$USE_JQ" = true ]; then
    BLOCK_COUNT=$(echo "$LIST_RESULT" | jq 'length')
    if [ "$BLOCK_COUNT" -gt 0 ]; then
        print_success "Listed $BLOCK_COUNT blocks"
        echo "$LIST_RESULT" | jq -r '.[] | "  - \(.name): \(.title)"' | head -5
        if [ "$BLOCK_COUNT" -gt 5 ]; then
            echo "  ... and $((BLOCK_COUNT - 5)) more"
        fi
    else
        print_error "No blocks returned"
    fi
else
    if echo "$LIST_RESULT" | grep -q "designsetgo/flex"; then
        print_success "Blocks listed successfully"
    else
        print_error "Failed to list blocks"
    fi
fi

###############################################################################
# Test 5: Insert Flex Container
###############################################################################

print_header "Test 5: designsetgo/insert-flex-container"

print_test "Inserting Flex Container..."
FLEX_RESULT=$(curl -s -X POST \
    -u "$WP_USER:$WP_PASS" \
    -H "Content-Type: application/json" \
    "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
    -d "{
        \"post_id\": $TEST_POST_ID,
        \"attributes\": {
            \"direction\": \"row\",
            \"justifyContent\": \"center\",
            \"alignItems\": \"center\"
        }
    }")

if [ "$USE_JQ" = true ]; then
    SUCCESS=$(echo "$FLEX_RESULT" | jq -r '.success // false')
    if [ "$SUCCESS" = "true" ]; then
        BLOCK_ID=$(echo "$FLEX_RESULT" | jq -r '.block_id')
        print_success "Flex Container inserted - Block ID: $BLOCK_ID"
    else
        ERROR_MSG=$(echo "$FLEX_RESULT" | jq -r '.message // "Unknown error"')
        print_error "Failed to insert: $ERROR_MSG"
    fi
else
    if echo "$FLEX_RESULT" | grep -q "success"; then
        print_success "Flex Container inserted"
    else
        print_error "Failed to insert Flex Container"
    fi
fi

###############################################################################
# Test 6: Insert Grid Container
###############################################################################

print_header "Test 6: designsetgo/insert-grid-container"

print_test "Inserting Grid Container..."
GRID_RESULT=$(curl -s -X POST \
    -u "$WP_USER:$WP_PASS" \
    -H "Content-Type: application/json" \
    "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-grid-container/execute" \
    -d "{
        \"post_id\": $TEST_POST_ID,
        \"attributes\": {
            \"desktopColumns\": 3,
            \"tabletColumns\": 2,
            \"mobileColumns\": 1
        }
    }")

if [ "$USE_JQ" = true ]; then
    SUCCESS=$(echo "$GRID_RESULT" | jq -r '.success // false')
    if [ "$SUCCESS" = "true" ]; then
        print_success "Grid Container inserted"
    else
        ERROR_MSG=$(echo "$GRID_RESULT" | jq -r '.message // "Unknown error"')
        print_error "Failed to insert: $ERROR_MSG"
    fi
else
    if echo "$GRID_RESULT" | grep -q "success"; then
        print_success "Grid Container inserted"
    else
        print_error "Failed to insert Grid Container"
    fi
fi

###############################################################################
# Test 7: Apply Animation
###############################################################################

print_header "Test 7: designsetgo/apply-animation"

# Create post with heading for animation test
ANIM_POST_ID=$(npx wp-env run cli wp post create \
    --post_title="Animation Test $(date +%s)" \
    --post_content='<!-- wp:heading --><h2>Test Heading</h2><!-- /wp:heading -->' \
    --post_status=publish \
    --porcelain 2>/dev/null || echo "")

if [ -n "$ANIM_POST_ID" ]; then
    print_info "Created animation test post ID: $ANIM_POST_ID"

    print_test "Applying animation to heading..."
    ANIM_RESULT=$(curl -s -X POST \
        -u "$WP_USER:$WP_PASS" \
        -H "Content-Type: application/json" \
        "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/apply-animation/execute" \
        -d "{
            \"post_id\": $ANIM_POST_ID,
            \"block_name\": \"core/heading\",
            \"animation\": {
                \"enabled\": true,
                \"entranceAnimation\": \"fadeInUp\",
                \"trigger\": \"scroll\",
                \"duration\": 600
            }
        }")

    if [ "$USE_JQ" = true ]; then
        SUCCESS=$(echo "$ANIM_RESULT" | jq -r '.success // false')
        if [ "$SUCCESS" = "true" ]; then
            UPDATED=$(echo "$ANIM_RESULT" | jq -r '.updated_count')
            print_success "Animation applied to $UPDATED block(s)"
        else
            ERROR_MSG=$(echo "$ANIM_RESULT" | jq -r '.message // "Unknown error"')
            print_error "Failed to apply animation: $ERROR_MSG"
        fi
    else
        if echo "$ANIM_RESULT" | grep -q "success"; then
            print_success "Animation applied"
        else
            print_error "Failed to apply animation"
        fi
    fi
else
    print_error "Failed to create animation test post"
fi

###############################################################################
# Test 8: Error Handling
###############################################################################

print_header "Test 8: Error Handling"

print_test "Testing invalid post ID (should fail gracefully)..."
ERROR_RESULT=$(curl -s -X POST \
    -u "$WP_USER:$WP_PASS" \
    -H "Content-Type: application/json" \
    "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
    -d '{"post_id": 999999}')

if [ "$USE_JQ" = true ]; then
    ERROR_CODE=$(echo "$ERROR_RESULT" | jq -r '.code // empty')
    if [ "$ERROR_CODE" = "invalid_post" ]; then
        print_success "Error handling works correctly"
    else
        print_error "Unexpected error response"
    fi
else
    if echo "$ERROR_RESULT" | grep -q "invalid_post"; then
        print_success "Error handling works correctly"
    else
        print_error "Unexpected error response"
    fi
fi

###############################################################################
# Summary
###############################################################################

print_header "Test Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo -e "Total Tests:  $TOTAL_TESTS"
echo -e "${GREEN}Passed:       $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed:       $TESTS_FAILED${NC}"
else
    echo -e "Failed:       $TESTS_FAILED"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "1. View test post: $WP_URL/wp-admin/post.php?post=$TEST_POST_ID&action=edit"
    echo "2. Check frontend: $WP_URL/?p=$TEST_POST_ID"
    echo "3. Read full docs: docs/TESTING-ABILITIES-API.md"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}  ✗ SOME TESTS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check logs: npx wp-env logs"
    echo "2. Verify Composer: composer show wordpress/abilities-api"
    echo "3. Rebuild plugin: npm run build && npx wp-env restart"
    echo "4. See docs: docs/TESTING-ABILITIES-API.md"
    echo ""
    exit 1
fi
